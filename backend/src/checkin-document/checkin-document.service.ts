import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Express } from 'express';

type CheckinDocumentType = 'id-card' | 'passport';

type CheckinDocumentExtraction = {
  fullName: string | null;
  birthDate: string | null;
  gender: string | null;
  documentNumber: string | null;
  expiryDate: string | null;
  entryDate: string | null;
  nationality: string | null;
  address: string | null;
  documentType: CheckinDocumentType | null;
  isExpectedDocument: boolean;
  isFrontSide: boolean;
  confidence: number;
  notes: string | null;
  validationMessage: string | null;
};

type OpenAIResponseContent = {
  type?: string;
  text?: string;
  refusal?: string;
};

type OpenAIResponseOutput = {
  type?: string;
  content?: OpenAIResponseContent[];
};

type OpenAIResponsePayload = {
  output_text?: string;
  output?: OpenAIResponseOutput[];
  error?: {
    message?: string;
  };
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const SUPPORTED_IMAGE_MIME_TYPES = new Set(['image/jpeg', 'image/png']);

@Injectable()
export class CheckinDocumentService {
  private readonly openaiApiKey: string | undefined;
  private readonly openaiApiUrl = 'https://api.openai.com/v1/responses';
  private readonly model: string;

  constructor(private readonly configService: ConfigService) {
    this.openaiApiKey =
      this.configService.get<string>('OPENAI_API_KEY') || undefined;
    this.model =
      this.configService.get<string>('OPENAI_CHECKIN_MODEL') || 'gpt-4o-mini';
  }

  async analyzeDocuments(
    files: Express.Multer.File[],
    documentType?: string,
  ): Promise<CheckinDocumentExtraction> {
    if (!this.openaiApiKey) {
      throw new BadRequestException('OpenAI API is not configured');
    }

    if (!files?.length) {
      throw new BadRequestException('Vui lòng upload ít nhất một ảnh giấy tờ');
    }

    files.forEach((file) => this.validateImage(file));

    const normalizedDocumentType = this.normalizeDocumentType(documentType);
    const imageContent = files.map((file) => ({
      type: 'input_image',
      image_url: `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
      detail: 'high',
    }));

    const response = await fetch(this.openaiApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.openaiApiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        instructions: this.createInstructions(normalizedDocumentType),
        input: [
          {
            role: 'user',
            content: [
              {
                type: 'input_text',
                text:
                  'Extract check-in information from these identity document images. Return JSON only. If a field is not visible, use null.',
              },
              ...imageContent,
            ],
          },
        ],
        text: {
          format: {
            type: 'json_schema',
            name: 'checkin_document_extraction',
            strict: true,
            schema: this.getExtractionSchema(),
          },
        },
        temperature: 0,
        max_output_tokens: 1200,
      }),
    });

    const payload = (await response.json()) as OpenAIResponsePayload;

    if (!response.ok) {
      throw new BadRequestException(
        payload.error?.message || 'OpenAI document analysis failed',
      );
    }

    const text = this.extractOutputText(payload);
    const parsed = this.parseExtraction(text);

    return this.normalizeExtraction(parsed, normalizedDocumentType);
  }

  private validateImage(file: Express.Multer.File) {
    if (!SUPPORTED_IMAGE_MIME_TYPES.has(file.mimetype)) {
      throw new BadRequestException(
        'Chỉ hỗ trợ ảnh JPG hoặc PNG / JPG or PNG only',
      );
    }

    if (file.size > MAX_IMAGE_SIZE) {
      throw new BadRequestException(
        'Ảnh tối đa 5MB / Maximum image size is 5MB',
      );
    }
  }

  private normalizeDocumentType(value?: string): CheckinDocumentType {
    return value === 'passport' ? 'passport' : 'id-card';
  }

  private createInstructions(documentType: CheckinDocumentType) {
    const documentLabel =
      documentType === 'passport'
        ? 'passport information page and optional entry stamp'
        : 'Vietnamese physical ID card front or electronic citizen identity information page';

    return [
      'You extract guest check-in fields from identity document images for a hotel form.',
      `The expected document is: ${documentLabel}.`,
      'Return only data clearly visible in the images. Do not guess missing phone numbers or emails.',
      'Normalize dates to YYYY-MM-DD. If a date cannot be confidently normalized, return null.',
      'For Vietnamese citizen IDs, nationality should be "Việt Nam" when visible or strongly implied by the document type.',
      'For gender, use "Nam / Male", "Nữ / Female", or null.',
      'For names, keep uppercase/lowercase from the document when possible and remove extra whitespace.',
      'For address, include the full visible permanent/place of residence address if present.',
      documentType === 'id-card'
        ? 'Validation is strict: accept either (1) the front of a physical Vietnamese CMND/CCCD/citizen identity card or (2) the electronic citizen identity information page displayed by an official identity application such as VNeID. For electronic identity, the surrounding phone, tablet, computer screen, application controls, reflections, or background are allowed and must not cause rejection when the identity page clearly shows the portrait, personal identification number, full name, and date of birth. Set isExpectedDocument and isFrontSide to true for either valid form. The physical card back side, unrelated application screen, another document, portrait/selfie, edited mockup, or an image too unclear to read the primary identity fields must return false.'
        : 'Validation is strict: isExpectedDocument is true only for a passport. isFrontSide is true only for the passport biographical information page containing the portrait and primary identity fields. A cover, visa page, entry stamp page, another document, or an unclear image must return false.',
      'When uncertain, return false. Do not infer that the image is valid only because the requested documentType was supplied.',
      'Set validationMessage to a short bilingual Vietnamese / English reason when either validation flag is false; otherwise return null.',
    ].join('\n');
  }

  private getExtractionSchema() {
    return {
      type: 'object',
      additionalProperties: false,
      required: [
        'fullName',
        'birthDate',
        'gender',
        'documentNumber',
        'expiryDate',
        'entryDate',
        'nationality',
        'address',
        'documentType',
        'isExpectedDocument',
        'isFrontSide',
        'confidence',
        'notes',
        'validationMessage',
      ],
      properties: {
        fullName: {
          type: ['string', 'null'],
          description: 'Full name printed on the document.',
        },
        birthDate: {
          type: ['string', 'null'],
          description: 'Date of birth in YYYY-MM-DD.',
        },
        gender: {
          type: ['string', 'null'],
          description: 'Gender as Nam / Male, Nữ / Female, or null.',
        },
        documentNumber: {
          type: ['string', 'null'],
          description: 'ID card, citizen ID, or passport number.',
        },
        expiryDate: {
          type: ['string', 'null'],
          description: 'Document expiration date in YYYY-MM-DD.',
        },
        entryDate: {
          type: ['string', 'null'],
          description: 'Vietnam entry date from passport stamp in YYYY-MM-DD.',
        },
        nationality: {
          type: ['string', 'null'],
          description: 'Nationality shown or implied by the document.',
        },
        address: {
          type: ['string', 'null'],
          description: 'Permanent/place of residence address if visible.',
        },
        documentType: {
          type: ['string', 'null'],
          enum: ['id-card', 'passport', null],
        },
        isExpectedDocument: {
          type: 'boolean',
          description:
            'Whether the image clearly contains the requested identity document type.',
        },
        isFrontSide: {
          type: 'boolean',
          description:
            'Whether the image clearly shows the required front or biographical information side.',
        },
        confidence: {
          type: 'number',
          minimum: 0,
          maximum: 1,
        },
        notes: {
          type: ['string', 'null'],
          description: 'Short note about unreadable or missing fields.',
        },
        validationMessage: {
          type: ['string', 'null'],
          description:
            'Short bilingual rejection reason, or null when the document is valid.',
        },
      },
    };
  }

  private extractOutputText(payload: OpenAIResponsePayload) {
    if (payload.output_text) {
      return payload.output_text;
    }

    const content = payload.output
      ?.flatMap((item) => item.content || [])
      .find((item) => item.type === 'output_text' || item.text);

    if (content?.refusal) {
      throw new BadRequestException(content.refusal);
    }

    if (!content?.text) {
      throw new BadRequestException('OpenAI did not return extracted data');
    }

    return content.text;
  }

  private parseExtraction(text: string): Partial<CheckinDocumentExtraction> {
    try {
      return JSON.parse(text) as Partial<CheckinDocumentExtraction>;
    } catch {
      const match = text.match(/\{[\s\S]*\}/);

      if (!match) {
        throw new BadRequestException('Could not parse document data');
      }

      return JSON.parse(match[0]) as Partial<CheckinDocumentExtraction>;
    }
  }

  private normalizeExtraction(
    data: Partial<CheckinDocumentExtraction>,
    fallbackDocumentType: CheckinDocumentType,
  ): CheckinDocumentExtraction {
    return {
      fullName: this.cleanText(data.fullName),
      birthDate: this.normalizeDate(data.birthDate),
      gender: this.normalizeGender(data.gender),
      documentNumber: this.cleanText(data.documentNumber),
      expiryDate: this.normalizeDate(data.expiryDate),
      entryDate: this.normalizeDate(data.entryDate),
      nationality: this.cleanText(data.nationality),
      address: this.cleanText(data.address),
      documentType: data.documentType || fallbackDocumentType,
      isExpectedDocument: data.isExpectedDocument === true,
      isFrontSide: data.isFrontSide === true,
      confidence:
        typeof data.confidence === 'number'
          ? Math.min(1, Math.max(0, data.confidence))
          : 0,
      notes: this.cleanText(data.notes),
      validationMessage: this.cleanText(data.validationMessage),
    };
  }

  private cleanText(value?: string | null) {
    if (typeof value !== 'string') return null;

    const trimmed = value.replace(/\s+/g, ' ').trim();
    return trimmed || null;
  }

  private normalizeGender(value?: string | null) {
    const normalized = this.cleanText(value)?.toLowerCase();

    if (!normalized) return null;
    if (
      normalized.includes('nữ') ||
      normalized.includes('nu') ||
      normalized.includes('female')
    ) {
      return 'Nữ / Female';
    }
    if (normalized.includes('nam') || normalized.includes('male')) {
      return 'Nam / Male';
    }

    return null;
  }

  private normalizeDate(value?: string | null) {
    const cleaned = this.cleanText(value);
    if (!cleaned) return null;

    const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(cleaned);
    if (isoMatch) {
      return cleaned;
    }

    const slashMatch = /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/.exec(cleaned);
    if (slashMatch) {
      const [, day, month, year] = slashMatch;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    const parsed = new Date(cleaned);
    if (Number.isNaN(parsed.getTime())) {
      return null;
    }

    const year = parsed.getUTCFullYear();
    const month = String(parsed.getUTCMonth() + 1).padStart(2, '0');
    const day = String(parsed.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
