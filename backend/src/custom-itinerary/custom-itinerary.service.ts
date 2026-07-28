import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateItineraryDto } from './dto/create-itinerary.dto';

type SupportedLang = 'vi' | 'en' | 'ko' | 'zh' | 'ru' | 'hi';
type DestinationKey = 'ha-long' | 'hai-phong';

interface DestinationConfig {
  key: DestinationKey;
  canonicalName: string;
  englishName: string;
  aliases: string[];
  mapRegion: string;
  hotel: {
    name: string;
    address: string;
    mapUrl: string;
    descriptions: Record<SupportedLang, string>;
  };
  summaries: Record<SupportedLang, string>;
  systemContext: string;
}

@Injectable()
export class CustomItineraryService {
  private readonly openaiApiKey: string | undefined;
  private readonly openaiApiUrl = 'https://api.openai.com/v1/chat/completions';
  private readonly destinations: Record<DestinationKey, DestinationConfig> = {
    'ha-long': {
      key: 'ha-long',
      canonicalName: 'Hạ Long',
      englishName: 'Ha Long',
      aliases: ['halong', 'halongbay', 'halongcity'],
      mapRegion: 'Hạ Long, Quảng Ninh, Việt Nam',
      hotel: {
        name: 'Anstay Residence by A La Carte Hạ Long',
        address: 'Khu đô thị dịch vụ Hùng Thắng, P. Hùng Thắng, Hạ Long, Quảng Ninh, Việt Nam',
        mapUrl: 'https://maps.app.goo.gl/m7c3NiYsydvmaTBd8',
        descriptions: {
          vi: 'Khách sạn cao cấp với đầy đủ tiện nghi, vị trí thuận lợi để khám phá Vịnh Hạ Long.',
          en: 'Premium hotel with full amenities, conveniently located for exploring Ha Long Bay.',
          ko: '완전한 편의 시설을 갖춘 프리미엄 호텔로 하롱베이를 둘러보기 좋은 위치입니다.',
          zh: '配套完善的高端酒店，位置便利，方便探索下龙湾。',
          ru: 'Премиальный отель со всеми удобствами, удобно расположенный для знакомства с бухтой Халонг.',
          hi: 'सभी सुविधाओं वाला प्रीमियम होटल, हा लॉन्ग बे घूमने के लिए सुविधाजनक स्थान पर।',
        },
      },
      summaries: {
        vi: 'Lịch trình khám phá Hạ Long với các điểm tham quan nổi tiếng và lưu trú tại Anstay Residence.',
        en: 'Ha Long exploration itinerary with famous attractions and a stay at Anstay Residence.',
        ko: '안스테이 레지던스에 머물며 하롱의 대표 명소를 둘러보는 일정입니다.',
        zh: '探索下龙的行程，涵盖著名景点并入住 Anstay Residence。',
        ru: 'Маршрут по Халонгу с известными достопримечательностями и проживанием в Anstay Residence.',
        hi: 'Anstay Residence में ठहराव के साथ हा लॉन्ग के प्रसिद्ध आकर्षणों को देखने की यात्रा योजना।',
      },
      systemContext: `REFERENCE FOR HA LONG:
- Main attractions: Ha Long Bay, Sung Sot Cave, Ti Top Island, Dau Go Cave, Thien Cung Cave, Luon Cave, Bai Tho Mountain, Quang Ninh Museum, Long Tien Pagoda
- Leisure areas: Bai Chay beach, Tuan Chau, Ha Long night market, Bai Chay walking street, Sun World Ha Long
- Food focus: Hong Hanh 1/2/3, Huong Bien, Be Anh, fresh seafood restaurants in Bai Chay
- Entertainment: bay cruise, kayak, squid fishing, sunset cruise, lounge, karaoke, massage
- Route logic: for 1 day focus on bay sightseeing or Bai Chay/Sun World; for 2 days split bay and city/beach/food; for 3+ days add museum, mountain, Tuan Chau and nightlife
- Never recommend Hai Phong-only places for this destination.`,
    },
    'hai-phong': {
      key: 'hai-phong',
      canonicalName: 'Hải Phòng',
      englishName: 'Hai Phong',
      aliases: ['haiphong', 'haiphongcity', 'haiphongportcity'],
      mapRegion: 'Hải Phòng, Việt Nam',
      hotel: {
        name: 'Anstay Vinhomes Vũ Yên',
        address: 'Đường Tài Lộc, Thuỷ Triều, Thuỷ Nguyên, Hải Phòng, Việt Nam',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=Anstay+Vinhomes+Vu+Yen+Hai+Phong',
        descriptions: {
          vi: 'Căn hộ hiện đại tại Vũ Yên, kết nối nhanh đến VinWonders, trung tâm thành phố và các không gian ven sông thư giãn.',
          en: 'Modern apartment in Vu Yen with quick access to VinWonders, the city center, and relaxing riverfront spaces.',
          ko: '브이옌에 위치한 현대적인 숙소로 빈원더스와 도심, 강변 휴식 공간까지 빠르게 이동할 수 있습니다.',
          zh: '位于武安岛的现代公寓，可快速前往 VinWonders、市中心和舒适的滨河空间。',
          ru: 'Современные апартаменты на острове Ву Йен с быстрым доступом к VinWonders, центру города и спокойным набережным.',
          hi: 'वू येन में आधुनिक अपार्टमेंट, जहां से VinWonders, शहर के केंद्र और आरामदायक नदी किनारे क्षेत्रों तक आसानी से पहुंचा जा सकता है।',
        },
      },
      summaries: {
        vi: 'Lịch trình khám phá Hải Phòng với trung tâm thành phố, Vũ Yên, Đồ Sơn và ẩm thực đất cảng đặc trưng.',
        en: 'Hai Phong itinerary covering the city center, Vu Yen, Do Son, and signature local food experiences.',
        ko: '도심, 브이옌, 도선과 항구 도시의 대표 먹거리를 담은 하이퐁 여행 일정입니다.',
        zh: '海防行程涵盖市中心、武安岛、涂山以及港口城市代表美食。',
        ru: 'Маршрут по Хайфону с центром города, Ву Йен, До Сон и характерной кухней портового города.',
        hi: 'हाइफोंग यात्रा योजना जिसमें शहर का केंद्र, वू येन, दो सोन और बंदरगाह शहर के खास स्थानीय व्यंजन शामिल हैं।',
      },
      systemContext: `REFERENCE FOR HAI PHONG:
- Core zones: city center (Hai Phong Opera House, Hai Phong Station, old post office, Tam Bac lake and walking street), Vu Yen Island (VinWonders Vu Yen, K-Park, Royal Island), Do Son (beach, Tuong Long Tower, Hon Dau lighthouse), Cat Ba - Lan Ha, Bach Dang Giang
- Family-friendly spots: VinWonders Vu Yen, Tam Bac walking street, Do Son beach, AEON Mall Le Chan, Vincom Plaza Imperia
- Adventure / photography: Cat Ba Island, Lan Ha Bay, Cat Ba National Park, Hon Dau Island, Tuong Long Tower, Bach Dang Giang historical site
- Signature food: banh da cua, bun ca cay, banh beo Hai Phong, nem cua be, banh mi cay, oc Hai Phong
- Recommended food stops: Banh da cua Ba Cu / Lach Tray / Da Lieu, Bun ca cay 66 Le Loi / Chu Lun / Cau Doanh, Phuong Mai or Nga Nem Cua Be, Ong Cuong banh mi cay, Huong Oc or Oc Na
- Route logic: for 1 day focus on city center + Vu Yen or Do Son; for 2 days use day 1 for city center + Vu Yen and day 2 for Do Son plus evening Tam Bac / food tour; for 3+ days dedicate Cat Ba - Lan Ha to a separate day because transfer takes time
- Never place Cat Ba and VinWonders Vu Yen in the same half-day, and never recommend Ha Long-only attractions for this destination.`,
    },
  };

  constructor(private configService: ConfigService) {
    this.openaiApiKey = this.configService.get<string>('OPENAI_API_KEY') || undefined;
    if (!this.openaiApiKey) {
      console.warn('OPENAI_API_KEY is not set. ChatGPT integration will not work.');
    }
  }

  async generateItinerary(dto: CreateItineraryDto): Promise<any> {
    if (!this.openaiApiKey) {
      throw new BadRequestException('ChatGPT API is not configured');
    }

    const { tripName, cities, startDate, endDate, adults, children } = dto;
    const lang = this.normalizeLang(dto.lang);
    const days = this.calculateRequestedDays(startDate, endDate);
    const destination = this.resolveDestination(cities);
    const prompt = this.createPrompt(lang, destination, tripName, days, adults, children);

    try {
      const response = await fetch(this.openaiApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.openaiApiKey!}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: this.getSystemPrompt(destination),
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 10000,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new BadRequestException(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new BadRequestException('No response from ChatGPT');
      }

      let itinerary: any;
      try {
        console.log('ChatGPT raw response length:', content.length);

        let jsonString = content;
        const fencedJson = content.match(/```json\s*([\s\S]*?)\s*```/);
        const fencedAny = content.match(/```\s*([\s\S]*?)\s*```/);
        const directJson = content.match(/\{[\s\S]*\}/);

        if (fencedJson) {
          jsonString = fencedJson[1];
        } else if (fencedAny) {
          jsonString = fencedAny[1];
        } else if (directJson) {
          jsonString = directJson[0];
        }

        itinerary = JSON.parse(jsonString);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Failed content:', content.substring(0, 500));
        itinerary = this.parseTextToItinerary(content, lang, days, destination);
      }

      itinerary.days = this.normalizeDays(itinerary.days, days, lang);
      itinerary = this.applyDestinationDefaults(itinerary, destination, lang);

      return {
        success: true,
        itinerary,
        lang,
        destinationCity: destination.canonicalName,
      };
    } catch (error) {
      console.error('Error generating itinerary:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate itinerary. Please try again later.';
      throw new BadRequestException(errorMessage);
    }
  }

  private normalizeLang(lang?: string): SupportedLang {
    if (lang === 'en' || lang === 'ko' || lang === 'zh' || lang === 'ru' || lang === 'hi') {
      return lang;
    }
    return 'vi';
  }

  private calculateRequestedDays(startDate?: string, endDate?: string): number {
    let days = 3;
    if (startDate && endDate) {
      const parseDateOnly = (dateStr: string): Date => {
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
          const [year, month, day] = dateStr.split('-').map(Number);
          return new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
        }

        const date = new Date(dateStr);
        return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0));
      };

      const start = parseDateOnly(startDate);
      const end = parseDateOnly(endDate);
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      days = diffDays + 1;

      const formatDateForLog = (date: Date): string => {
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      console.log(`Date calculation: ${startDate} to ${endDate} = ${days} days (diff: ${diffDays})`);
      console.log(`Parsed dates (UTC): start=${formatDateForLog(start)}, end=${formatDateForLog(end)}`);

      if (days < 1) days = 1;
      if (days > 10) days = 10;
    }

    return days;
  }

  private normalizeCityName(city: string): string {
    return city
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');
  }

  private resolveDestination(cities: string[]): DestinationConfig {
    const normalizedCities = (cities || []).map((city) => this.normalizeCityName(city));

    if (normalizedCities.some((city) => this.destinations['hai-phong'].aliases.includes(city))) {
      return this.destinations['hai-phong'];
    }

    return this.destinations['ha-long'];
  }

  private getSystemPrompt(destination: DestinationConfig): string {
    return `You are a professional travel planner for ${destination.englishName}, Vietnam. STRICT RULES:
1. Return ONLY valid JSON with no markdown, no code blocks and no explanations.
2. The response must follow this shape: {"days":[{"day":1,"title":"","activities":[{"time":"","title":"","description":"","location":"","icon":""}]}],"hotel":{"name":"","address":"","description":"","mapUrl":""},"summary":""}
3. Each day must contain 5-6 realistic activities including meals and sightseeing.
4. Use only real places, foods and transport options in ${destination.englishName}. Never mix in attractions from another city.
5. Keep the schedule geographically sensible. Group nearby places together and respect transfer time between zones.
6. Always use hotel "${destination.hotel.name}" with the exact address "${destination.hotel.address}" and the exact mapUrl "${destination.hotel.mapUrl}".
7. Descriptions should be concise, informative and useful for travellers.
8. Avoid repeating the same attraction on different days.

${destination.systemContext}`;
  }

  private createPrompt(
    lang: SupportedLang,
    destination: DestinationConfig,
    tripName: string,
    days: number,
    adults: number,
    children: number,
  ): string {
    switch (lang) {
      case 'en':
        return this.createEnglishPrompt(destination, tripName, days, adults, children);
      case 'ko':
        return this.createKoreanPrompt(destination, tripName, days, adults, children);
      case 'zh':
        return this.createChinesePrompt(destination, tripName, days, adults, children);
      case 'ru':
        return this.createRussianPrompt(destination, tripName, days, adults, children);
      case 'hi':
        return this.createHindiPrompt(destination, tripName, days, adults, children);
      default:
        return this.createVietnamesePrompt(destination, tripName, days, adults, children);
    }
  }

  private createVietnamesePrompt(
    destination: DestinationConfig,
    tripName: string,
    days: number,
    adults: number,
    children: number,
  ): string {
    const hasChildren = children > 0;

    return `Tạo lịch trình du lịch ${destination.canonicalName} CHÍNH XÁC ${days} NGÀY cho ${adults} người lớn${hasChildren ? `, ${children} trẻ em` : ''}.
Tên kỳ nghỉ: "${tripName || 'Kỳ nghỉ của bạn'}"

QUAN TRỌNG:
- JSON phải có ĐÚNG ${days} ngày trong mảng "days" (day 1 đến day ${days})
- Mỗi ngày cần 5-6 hoạt động hợp lý theo cung đường thực tế
- Không lặp lại cùng một điểm tham quan giữa các ngày
- Luôn dùng khách sạn "${destination.hotel.name}" với đúng địa chỉ và mapUrl đã yêu cầu
- Không đưa địa điểm thuộc thành phố khác vào lịch trình
- Mô tả nên cụ thể, ngắn gọn, hữu ích cho khách du lịch

YÊU CẦU LẬP LỊCH:
- ${hasChildren ? 'Ưu tiên hoạt động phù hợp gia đình có trẻ nhỏ, có thời gian nghỉ và ăn uống thuận tiện' : 'Có thể thêm hoạt động buổi tối như food tour, lounge, phố đi bộ hoặc trải nghiệm thư giãn'}
- Sắp xếp địa điểm gần nhau trong cùng một buổi
- Nếu di chuyển xa thì phải dành đủ thời gian, không xếp lịch dồn dập

${this.getVietnameseDestinationGuide(destination)}

JSON MẪU:
${this.getExampleJson(destination, 'vi')}`;
  }

  private createEnglishPrompt(
    destination: DestinationConfig,
    tripName: string,
    days: number,
    adults: number,
    children: number,
  ): string {
    const hasChildren = children > 0;

    return `Create an EXACT ${days}-day travel itinerary in ${destination.englishName} for ${adults} adults${hasChildren ? ` and ${children} children` : ''}.
Trip name: "${tripName || 'Your Vacation'}"

CRITICAL RULES:
- The JSON "days" array must contain EXACTLY ${days} items (day 1 to day ${days})
- Each day needs 5-6 realistic activities with sensible routing
- Do not repeat the same attraction on multiple days
- Always use the hotel "${destination.hotel.name}" with the required address and mapUrl
- Do not include attractions from another city
- Descriptions should be concise and helpful for travellers

PLANNING RULES:
- ${hasChildren ? 'Prioritize family-friendly activities, easy meals and comfortable pacing for children' : 'You may include nightlife, bars, walking streets or relaxing evening experiences when appropriate'}
- Group nearby places in the same time block
- Respect transfer times between distant zones

${this.getEnglishDestinationGuide(destination)}

SAMPLE JSON:
${this.getExampleJson(destination, 'en')}`;
  }

  private createKoreanPrompt(
    destination: DestinationConfig,
    tripName: string,
    days: number,
    adults: number,
    children: number,
  ): string {
    const hasChildren = children > 0;

    return `${destination.englishName}에서 정확히 ${days}일 여행 일정을 생성하세요. 성인 ${adults}명${hasChildren ? `, 어린이 ${children}명` : ''}.
여행 이름: "${tripName || '당신의 휴가'}"

중요 규칙:
- JSON의 "days" 배열에는 정확히 ${days}개의 항목이 있어야 합니다
- 하루에 5-6개의 현실적인 활동을 넣고 이동 동선이 자연스러워야 합니다
- 같은 명소를 여러 날 반복하지 마세요
- 호텔은 반드시 "${destination.hotel.name}"을 사용하고 주소와 mapUrl도 정확히 유지하세요
- 다른 도시의 명소를 넣지 마세요
- 설명은 짧고 유용하게 작성하세요

일정 구성 규칙:
- ${hasChildren ? '어린이를 동반한 가족이 편하게 이동할 수 있는 활동과 식사를 우선하세요' : '적절하다면 야간 산책, 라운지, 바, 야시장 같은 저녁 활동을 포함할 수 있습니다'}
- 가까운 장소는 같은 시간대에 묶으세요
- 먼 지역은 이동 시간을 충분히 반영하세요

${this.getKoreanDestinationGuide(destination)}

예시 JSON:
${this.getExampleJson(destination, 'ko')}`;
  }

  private createChinesePrompt(
    destination: DestinationConfig,
    tripName: string,
    days: number,
    adults: number,
    children: number,
  ): string {
    const hasChildren = children > 0;

    return `请为 ${destination.englishName} 生成准确 ${days} 天的旅行行程。成人 ${adults} 人${hasChildren ? `，儿童 ${children} 人` : ''}。
行程名称: "${tripName || '您的假期'}"

重要规则:
- JSON 的 "days" 数组必须正好有 ${days} 项
- 每天安排 5-6 个合理且路线顺畅的活动
- 不要在不同天重复同一个景点
- 酒店必须使用 "${destination.hotel.name}"，并保持准确地址和 mapUrl
- 不要加入其他城市的景点
- 描述要简洁、实用

排程要求:
- ${hasChildren ? '优先安排适合家庭和儿童的轻松活动与用餐' : '在合适情况下可加入夜市、步行街、酒吧或轻松夜间体验'}
- 将相近地点安排在同一时段
- 远距离区域必须预留足够交通时间

${this.getChineseDestinationGuide(destination)}

示例 JSON:
${this.getExampleJson(destination, 'zh')}`;
  }

  private createRussianPrompt(
    destination: DestinationConfig,
    tripName: string,
    days: number,
    adults: number,
    children: number,
  ): string {
    const hasChildren = children > 0;

    return `Создайте туристический маршрут по ${destination.englishName} ровно на ${days} дней для ${adults} взрослых${hasChildren ? ` и ${children} детей` : ''}.
Название поездки: "${tripName || 'Ваш отпуск'}"

ВАЖНЫЕ ПРАВИЛА:
- Массив JSON "days" должен содержать ровно ${days} элементов
- В каждом дне должно быть 5-6 реалистичных активностей с удобной логистикой
- Не повторяйте одну и ту же достопримечательность в разные дни
- Всегда используйте отель "${destination.hotel.name}" с точным адресом и mapUrl
- Не добавляйте достопримечательности из другого города
- Описания должны быть краткими, точными и полезными для гостей отеля

ПРАВИЛА ПЛАНИРОВАНИЯ:
- ${hasChildren ? 'Сделайте акцент на семейных активностях, удобном питании и спокойном темпе для детей' : 'Если уместно, добавьте вечерние прогулки, бары, ночной рынок или расслабляющие впечатления'}
- Группируйте близкие места в один временной блок
- Для дальних зон учитывайте реальное время в пути

${this.getRussianDestinationGuide(destination)}

ПРИМЕР JSON:
${this.getExampleJson(destination, 'ru')}`;
  }

  private createHindiPrompt(
    destination: DestinationConfig,
    tripName: string,
    days: number,
    adults: number,
    children: number,
  ): string {
    const hasChildren = children > 0;

    return `${destination.englishName} के लिए ${adults} वयस्कों${hasChildren ? ` और ${children} बच्चों` : ''} हेतु ठीक ${days} दिनों की यात्रा योजना बनाएं।
यात्रा का नाम: "${tripName || 'आपकी छुट्टी'}"

महत्वपूर्ण नियम:
- JSON के "days" array में ठीक ${days} items होने चाहिए
- हर दिन 5-6 वास्तविक गतिविधियां हों और मार्ग व्यावहारिक हो
- अलग-अलग दिनों में एक ही आकर्षण को दोहराएं नहीं
- हमेशा होटल "${destination.hotel.name}" का उपयोग करें और पता तथा mapUrl बिल्कुल सही रखें
- दूसरे शहर के आकर्षण शामिल न करें
- विवरण छोटे, स्पष्ट और होटल के मेहमानों के लिए उपयोगी होने चाहिए

योजना नियम:
- ${hasChildren ? 'बच्चों वाले परिवारों के लिए आरामदायक गतिविधियां, आसान भोजन और संतुलित गति को प्राथमिकता दें' : 'जहां उपयुक्त हो, शाम की सैर, बार, नाइट मार्केट या आरामदायक अनुभव जोड़ सकते हैं'}
- पास-पास की जगहों को एक ही समय खंड में रखें
- दूर के क्षेत्रों के लिए वास्तविक यात्रा समय रखें

${this.getHindiDestinationGuide(destination)}

JSON उदाहरण:
${this.getExampleJson(destination, 'hi')}`;
  }

  private getVietnameseDestinationGuide(destination: DestinationConfig): string {
    if (destination.key === 'hai-phong') {
      return `GỢI Ý ĐỊA ĐIỂM & CUNG ĐƯỜNG HẢI PHÒNG:
- Trung tâm thành phố: Nhà hát lớn Hải Phòng, Ga Hải Phòng, Bưu điện cũ, hồ Tam Bạc, phố đi bộ Tam Bạc
- Đảo Vũ Yên: VinWonders Vũ Yên, K-Park, quảng trường, không gian ven sông, café thư giãn
- Đồ Sơn: biển Đồ Sơn, tháp Tường Long, đảo Hòn Dấu, hải đăng
- Cát Bà - Vịnh Lan Hạ: bãi Cát Cò, Tùng Thu, chèo kayak, trekking vườn quốc gia
- Thủy Nguyên: khu di tích Bạch Đằng Giang
- Ẩm thực nên ưu tiên: bánh đa cua, bún cá cay, bánh bèo Hải Phòng, nem cua bể, bánh mì cay, ốc Hải Phòng
- Gợi ý nhịp đi hợp lý: 1 ngày nên chọn trung tâm + Vũ Yên hoặc trung tâm + Đồ Sơn; 2 ngày nên tách ngày 1 trung tâm + Vũ Yên, ngày 2 Đồ Sơn + Tam Bạc + food tour; từ 3 ngày trở lên mới nên dành riêng một ngày cho Cát Bà - Lan Hạ
- Không xếp Cát Bà và VinWonders Vũ Yên trong cùng nửa ngày.`;
    }

    return `GỢI Ý ĐỊA ĐIỂM & CUNG ĐƯỜNG HẠ LONG:
- Vịnh Hạ Long, hang Sửng Sốt, đảo Ti Tốp, động Thiên Cung, hang Đầu Gỗ
- Bãi Cháy, Tuần Châu, Sun World Hạ Long, chợ đêm Hạ Long, phố đi bộ, Bảo tàng Quảng Ninh
- Ẩm thực nên ưu tiên: hải sản Hồng Hạnh 1/2/3, Hương Biển, Bé Anh, các quán hải sản khu Bãi Cháy
- Lịch 1 ngày nên tập trung một cụm như vịnh hoặc Bãi Cháy - Sun World; lịch 2 ngày nên tách một ngày tham quan vịnh, một ngày khám phá thành phố - biển - ẩm thực; từ 3 ngày có thể thêm bảo tàng, núi Bài Thơ và trải nghiệm đêm.`;
  }

  private getEnglishDestinationGuide(destination: DestinationConfig): string {
    if (destination.key === 'hai-phong') {
      return `HAI PHONG GUIDE:
- City center: Hai Phong Opera House, Hai Phong Station, old post office, Tam Bac lake and walking street
- Vu Yen Island: VinWonders Vu Yen, K-Park, riverside squares and cafés
- Do Son: beach, Tuong Long Tower, Hon Dau Island and lighthouse
- Cat Ba - Lan Ha: Cat Co beaches, Tung Thu, kayaking, Cat Ba National Park
- Thuy Nguyen: Bach Dang Giang historical site
- Food focus: banh da cua, bun ca cay, banh beo Hai Phong, nem cua be, banh mi cay, local snail dishes
- Good routing: for 1 day choose city center + Vu Yen or city center + Do Son; for 2 days use day 1 for city center + Vu Yen and day 2 for Do Son + Tam Bac + food tour; only from 3 days onward should Cat Ba - Lan Ha get a dedicated day
- Never schedule Cat Ba and VinWonders Vu Yen in the same half-day.`;
    }

    return `HA LONG GUIDE:
- Attractions: Ha Long Bay, Sung Sot Cave, Ti Top Island, Thien Cung Cave, Dau Go Cave
- Leisure zones: Bai Chay, Tuan Chau, Sun World Ha Long, night market, walking street, Quang Ninh Museum
- Food focus: Hong Hanh 1/2/3, Huong Bien, Be Anh and strong seafood options in Bai Chay
- Good routing: for 1 day focus on the bay or Bai Chay / Sun World; for 2 days split the bay day and the city / beach / food day; for 3+ days add museum, Bai Tho Mountain and evening experiences.`;
  }

  private getKoreanDestinationGuide(destination: DestinationConfig): string {
    if (destination.key === 'hai-phong') {
      return `하이퐁 가이드:
- 도심: 하이퐁 오페라하우스, 하이퐁역, 옛 우체국, 탐박 호수와 보행 거리
- 브이옌 섬: 빈원더스 브이옌, K-Park, 강변 광장과 카페
- 도선: 해변, 뜨엉롱 타워, 혼저우 섬과 등대
- 깟바 - 란하: 깟코 해변, 퉁투, 카약, 깟바 국립공원
- 투이응우옌: 박당장 역사 유적지
- 음식: 반다꾸어, 분까까이, 하이퐁 반베오, 넴꾸어베, 반미까이, 현지 해산물과 달팽이 요리
- 1일 일정은 도심 + 브이옌 또는 도심 + 도선, 2일 일정은 1일차 도심 + 브이옌, 2일차 도선 + 탐박 + 푸드투어가 적합하며 3일 이상일 때만 깟바 - 란하를 하루 따로 배정하세요
- 깟바와 빈원더스 브이옌을 같은 반나절에 넣지 마세요.`;
    }

    return `하롱 가이드:
- 명소: 하롱베이, 숭솟 동굴, 티톱 섬, 티엔꿍 동굴, 더우고 동굴
- 여가 구역: 바이짜이, 뚜언쩌우, 선월드 하롱, 야시장, 산책로, 꽝닌 박물관
- 음식: 홍하인 1/2/3, 흐엉비엔, 베아인 등 바이짜이 해산물 식당
- 1일은 하롱베이 또는 바이짜이 / 선월드에 집중하고, 2일은 베이 일정과 시내 / 해변 / 미식 일정을 나누며, 3일 이상은 박물관과 바이토 산, 야간 경험을 추가하세요.`;
  }

  private getChineseDestinationGuide(destination: DestinationConfig): string {
    if (destination.key === 'hai-phong') {
      return `海防指南:
- 市中心: 海防歌剧院、海防火车站、老邮局、三泊湖与步行街
- 武安岛: VinWonders Vũ Yên、K-Park、滨河广场与咖啡馆
- 涂山: 海滩、祥龙塔、鸿岛与灯塔
- 吉婆岛 - 兰夏湾: Cat Co 海滩、Tung Thu、皮划艇、国家公园
- 水源县: 白藤江历史遗址
- 美食重点: 蟹粉红米粉、辣鱼粉、海防蒸米饼、蟹肉春卷、辣味法棍、海鲜螺类
- 合理路线: 1 天可选市中心 + 武安岛或市中心 + 涂山；2 天可安排第 1 天市中心 + 武安岛，第 2 天涂山 + 三泊湖 + 美食路线；3 天以上再单独安排吉婆岛 - 兰夏湾
- 不要把吉婆岛和 VinWonders Vũ Yên 排在同一个半天。`;
    }

    return `下龙指南:
- 景点: 下龙湾、惊讶洞、天堂岛、天宫洞、头木洞
- 休闲区域: 拜斋、团洲、太阳世界、夜市、步行街、广宁博物馆
- 美食重点: 红幸 1/2/3、Huong Bien、Be Anh 及拜斋海鲜餐厅
- 合理路线: 1 天可专注海湾或拜斋 / 太阳世界；2 天可拆分为海湾观光日和城市 / 海滩 / 美食日；3 天以上再加入博物馆、拜诗山和夜间体验。`;
  }

  private getRussianDestinationGuide(destination: DestinationConfig): string {
    if (destination.key === 'hai-phong') {
      return `ГИД ПО ХАЙФОНУ:
- Центр города: Оперный театр Хайфона, вокзал Хайфона, старое почтовое отделение, озеро Там Бак и пешеходная улица
- Остров Ву Йен: VinWonders Vu Yen, K-Park, набережные площади и кафе
- До Сон: пляж, башня Tuong Long, остров Hon Dau и маяк
- Кат Ба - Лан Ха: пляжи Cat Co, Tung Thu, каякинг, национальный парк Cat Ba
- Тхюи Нгуен: исторический комплекс Bach Dang Giang
- Еда: banh da cua, bun ca cay, banh beo Hai Phong, nem cua be, banh mi cay, местные блюда из улиток и морепродуктов
- Логика маршрута: на 1 день выбирайте центр + Ву Йен или центр + До Сон; на 2 дня день 1 центр + Ву Йен, день 2 До Сон + Там Бак + гастротур; Кат Ба - Лан Ха выделяйте отдельным днем только при 3+ днях
- Не ставьте Кат Ба и VinWonders Vu Yen в один и тот же полдень.`;
    }

    return `ГИД ПО ХАЛОНГУ:
- Достопримечательности: бухта Халонг, пещера Sung Sot, остров Ti Top, пещера Thien Cung, пещера Dau Go
- Зоны отдыха: Bai Chay, Tuan Chau, Sun World Ha Long, ночной рынок, пешеходная улица, музей Quang Ninh
- Еда: Hong Hanh 1/2/3, Huong Bien, Be Anh и хорошие рестораны морепродуктов в Bai Chay
- Логика маршрута: на 1 день сосредоточьтесь на бухте или Bai Chay / Sun World; на 2 дня разделите бухту и город / пляж / еду; на 3+ дня добавьте музей, гору Bai Tho и вечерние впечатления.`;
  }

  private getHindiDestinationGuide(destination: DestinationConfig): string {
    if (destination.key === 'hai-phong') {
      return `हाइफोंग गाइड:
- शहर का केंद्र: Hai Phong Opera House, Hai Phong Station, पुराना पोस्ट ऑफिस, Tam Bac lake और walking street
- Vu Yen Island: VinWonders Vu Yen, K-Park, नदी किनारे चौक और कैफे
- Do Son: समुद्र तट, Tuong Long Tower, Hon Dau Island और lighthouse
- Cat Ba - Lan Ha: Cat Co beaches, Tung Thu, kayaking, Cat Ba National Park
- Thuy Nguyen: Bach Dang Giang historical site
- भोजन: banh da cua, bun ca cay, banh beo Hai Phong, nem cua be, banh mi cay, स्थानीय seafood और snail dishes
- व्यावहारिक मार्ग: 1 दिन में city center + Vu Yen या city center + Do Son चुनें; 2 दिनों में दिन 1 city center + Vu Yen और दिन 2 Do Son + Tam Bac + food tour रखें; 3+ दिनों पर ही Cat Ba - Lan Ha को अलग दिन दें
- Cat Ba और VinWonders Vu Yen को एक ही half-day में न रखें।`;
    }

    return `हा लॉन्ग गाइड:
- आकर्षण: Ha Long Bay, Sung Sot Cave, Ti Top Island, Thien Cung Cave, Dau Go Cave
- आराम क्षेत्र: Bai Chay, Tuan Chau, Sun World Ha Long, night market, walking street, Quang Ninh Museum
- भोजन: Hong Hanh 1/2/3, Huong Bien, Be Anh और Bai Chay के अच्छे seafood restaurants
- व्यावहारिक मार्ग: 1 दिन में bay या Bai Chay / Sun World पर ध्यान दें; 2 दिनों में bay day और city / beach / food day अलग रखें; 3+ दिनों में museum, Bai Tho Mountain और evening experiences जोड़ें।`;
  }

  private getExampleJson(destination: DestinationConfig, lang: SupportedLang): string {
    if (destination.key === 'hai-phong') {
      switch (lang) {
        case 'en':
          return `{"days":[{"day":1,"title":"Hai Phong city center and Vu Yen","activities":[{"time":"07:30","title":"Breakfast with banh da cua","description":"Start the day with Hai Phong's signature crab noodle soup in the city center","location":"Banh da cua Ba Cu"},{"time":"09:00","title":"Check-in at the city landmarks","description":"Visit the Opera House, Hai Phong Station and the old post office in one walkable route","location":"Hai Phong Opera House"}]}],"hotel":{"name":"${destination.hotel.name}","address":"${destination.hotel.address}","description":"${destination.hotel.descriptions.en}","mapUrl":"${destination.hotel.mapUrl}"},"summary":"Explore the port city through its food, city center, Vu Yen and nearby coastal experiences."}`;
        case 'ko':
          return `{"days":[{"day":1,"title":"하이퐁 도심과 브이옌","activities":[{"time":"07:30","title":"반다꾸어 아침 식사","description":"도심에서 하이퐁 대표 음식인 게살 쌀국수로 하루를 시작합니다","location":"Banh da cua Ba Cu"},{"time":"09:00","title":"도심 랜드마크 산책","description":"오페라하우스, 하이퐁역, 옛 우체국을 한 동선으로 둘러봅니다","location":"Hai Phong Opera House"}]}],"hotel":{"name":"${destination.hotel.name}","address":"${destination.hotel.address}","description":"${destination.hotel.descriptions.ko}","mapUrl":"${destination.hotel.mapUrl}"},"summary":"항구 도시의 미식, 도심, 브이옌과 인근 해변을 함께 즐기는 일정입니다."}`;
        case 'zh':
          return `{"days":[{"day":1,"title":"海防市中心与武安岛","activities":[{"time":"07:30","title":"品尝蟹粉红米粉早餐","description":"在市中心用海防招牌蟹粉红米粉开启一天","location":"Banh da cua Ba Cu"},{"time":"09:00","title":"打卡城市地标","description":"沿步行路线参观歌剧院、火车站和老邮局","location":"Hai Phong Opera House"}]}],"hotel":{"name":"${destination.hotel.name}","address":"${destination.hotel.address}","description":"${destination.hotel.descriptions.zh}","mapUrl":"${destination.hotel.mapUrl}"},"summary":"从港口城市美食、市中心、武安岛到海边景点的平衡行程。"}`;
        case 'ru':
          return `{"days":[{"day":1,"title":"Центр Хайфона и Ву Йен","activities":[{"time":"07:30","title":"Завтрак с banh da cua","description":"Начните день в центре города с фирменного крабового супа с лапшой Хайфона","location":"Banh da cua Ba Cu"},{"time":"09:00","title":"Прогулка по городским символам","description":"Посетите Оперный театр, вокзал Хайфона и старое почтовое отделение по удобному пешему маршруту","location":"Hai Phong Opera House"}]}],"hotel":{"name":"${destination.hotel.name}","address":"${destination.hotel.address}","description":"${destination.hotel.descriptions.ru}","mapUrl":"${destination.hotel.mapUrl}"},"summary":"Маршрут сочетает кухню портового города, центр Хайфона, Ву Йен и прибрежные впечатления."}`;
        case 'hi':
          return `{"days":[{"day":1,"title":"हाइफोंग शहर केंद्र और वू येन","activities":[{"time":"07:30","title":"banh da cua के साथ नाश्ता","description":"शहर के केंद्र में हाइफोंग के खास crab noodle soup से दिन शुरू करें","location":"Banh da cua Ba Cu"},{"time":"09:00","title":"शहर के प्रमुख स्थलों की सैर","description":"Opera House, Hai Phong Station और पुराने post office को एक सुविधाजनक walking route में देखें","location":"Hai Phong Opera House"}]}],"hotel":{"name":"${destination.hotel.name}","address":"${destination.hotel.address}","description":"${destination.hotel.descriptions.hi}","mapUrl":"${destination.hotel.mapUrl}"},"summary":"यह योजना बंदरगाह शहर के भोजन, शहर केंद्र, वू येन और तटीय अनुभवों को संतुलित करती है।"}`;
        default:
          return `{"days":[{"day":1,"title":"Khám phá trung tâm Hải Phòng và Vũ Yên","activities":[{"time":"07:30","title":"Ăn sáng bánh đa cua","description":"Bắt đầu ngày mới với món bánh đa cua đặc trưng của đất cảng","location":"Bánh đa cua Bà Cụ"},{"time":"09:00","title":"Check-in trung tâm thành phố","description":"Dạo Nhà hát lớn, Ga Hải Phòng và Bưu điện cũ theo cung đường thuận tiện","location":"Nhà hát lớn Hải Phòng"}]}],"hotel":{"name":"${destination.hotel.name}","address":"${destination.hotel.address}","description":"${destination.hotel.descriptions.vi}","mapUrl":"${destination.hotel.mapUrl}"},"summary":"Hành trình kết hợp ẩm thực Hải Phòng, điểm đến trung tâm, Vũ Yên và biển Đồ Sơn."}`;
      }
    }

    switch (lang) {
      case 'en':
        return `{"days":[{"day":1,"title":"Explore Ha Long Bay","activities":[{"time":"07:00","title":"Breakfast buffet","description":"Enjoy a rich breakfast before starting a full day of bay sightseeing","location":"${destination.hotel.name}"},{"time":"08:30","title":"Ha Long Bay cruise","description":"Visit limestone islands and caves on a classic UNESCO bay route","location":"Tuan Chau Harbor"}]}],"hotel":{"name":"${destination.hotel.name}","address":"${destination.hotel.address}","description":"${destination.hotel.descriptions.en}","mapUrl":"${destination.hotel.mapUrl}"},"summary":"A balanced Ha Long plan with bay highlights, seafood dining and seaside leisure."}`;
      case 'ko':
        return `{"days":[{"day":1,"title":"하롱베이 탐험","activities":[{"time":"07:00","title":"뷔페 조식","description":"하루 종일 베이 관광을 시작하기 전 풍성한 조식을 즐깁니다","location":"${destination.hotel.name}"},{"time":"08:30","title":"하롱베이 크루즈","description":"유네스코 만의 석회암 섬과 동굴을 둘러보는 대표 코스입니다","location":"Tuan Chau Harbor"}]}],"hotel":{"name":"${destination.hotel.name}","address":"${destination.hotel.address}","description":"${destination.hotel.descriptions.ko}","mapUrl":"${destination.hotel.mapUrl}"},"summary":"하롱베이 핵심 명소와 해산물, 해변 휴식을 담은 균형 잡힌 일정입니다."}`;
      case 'zh':
        return `{"days":[{"day":1,"title":"探索下龙湾","activities":[{"time":"07:00","title":"酒店自助早餐","description":"在开始海湾观光前先享用丰富早餐","location":"${destination.hotel.name}"},{"time":"08:30","title":"下龙湾游船","description":"沿经典路线欣赏联合国教科文组织海湾中的石灰岩岛屿与洞穴","location":"Tuan Chau Harbor"}]}],"hotel":{"name":"${destination.hotel.name}","address":"${destination.hotel.address}","description":"${destination.hotel.descriptions.zh}","mapUrl":"${destination.hotel.mapUrl}"},"summary":"平衡安排下龙湾精华、美味海鲜与海边休闲体验。"}`;
      case 'ru':
        return `{"days":[{"day":1,"title":"Знакомство с бухтой Халонг","activities":[{"time":"07:00","title":"Завтрак buffet","description":"Начните день с плотного завтрака перед прогулкой по бухте","location":"${destination.hotel.name}"},{"time":"08:30","title":"Круиз по бухте Халонг","description":"Посмотрите известняковые острова и пещеры по классическому маршруту UNESCO","location":"Tuan Chau Harbor"}]}],"hotel":{"name":"${destination.hotel.name}","address":"${destination.hotel.address}","description":"${destination.hotel.descriptions.ru}","mapUrl":"${destination.hotel.mapUrl}"},"summary":"Сбалансированный маршрут по Халонгу с бухтой, морепродуктами и отдыхом у моря."}`;
      case 'hi':
        return `{"days":[{"day":1,"title":"हा लॉन्ग बे की सैर","activities":[{"time":"07:00","title":"Breakfast buffet","description":"बे देखने के पूरे दिन से पहले अच्छा नाश्ता करें","location":"${destination.hotel.name}"},{"time":"08:30","title":"हा लॉन्ग बे cruise","description":"UNESCO bay route पर limestone islands और caves देखें","location":"Tuan Chau Harbor"}]}],"hotel":{"name":"${destination.hotel.name}","address":"${destination.hotel.address}","description":"${destination.hotel.descriptions.hi}","mapUrl":"${destination.hotel.mapUrl}"},"summary":"हा लॉन्ग की मुख्य bay highlights, seafood dining और seaside leisure के साथ संतुलित योजना।"}`;
      default:
        return `{"days":[{"day":1,"title":"Khám phá Vịnh Hạ Long","activities":[{"time":"07:00","title":"Ăn sáng buffet","description":"Thưởng thức bữa sáng đầy đủ trước khi bắt đầu hành trình tham quan vịnh","location":"${destination.hotel.name}"},{"time":"08:30","title":"Du thuyền Vịnh Hạ Long","description":"Khám phá các đảo đá vôi và hang động nổi bật trên tuyến tham quan kinh điển","location":"Cảng Tuần Châu"}]}],"hotel":{"name":"${destination.hotel.name}","address":"${destination.hotel.address}","description":"${destination.hotel.descriptions.vi}","mapUrl":"${destination.hotel.mapUrl}"},"summary":"Lịch trình cân bằng giữa tham quan vịnh, ẩm thực hải sản và thư giãn ven biển."}`;
    }
  }

  private normalizeDays(daysData: any[], expectedDays: number, lang: SupportedLang): any[] {
    const sourceDays = Array.isArray(daysData) ? daysData : [];

    return Array.from({ length: expectedDays }, (_, index) => {
      const dayNumber = index + 1;
      const dayData =
        sourceDays.find((item) => Number(item?.day) === dayNumber) ||
        sourceDays[index] ||
        {};

      const rawActivities = Array.isArray(dayData.activities)
        ? dayData.activities
        : Array.isArray(dayData.itinerary)
          ? dayData.itinerary
          : [];

      return {
        day: dayNumber,
        title: typeof dayData.title === 'string' && dayData.title.trim() ? dayData.title : this.getDayTitle(dayNumber, lang),
        activities: rawActivities.map((activity: any) => ({
          time: activity?.time || '',
          title: activity?.title || activity?.activity || activity?.name || '',
          description: activity?.description || activity?.details || '',
          location: activity?.location || '',
          icon: activity?.icon || 'bi-geo-alt',
        })),
      };
    });
  }

  private applyDestinationDefaults(itinerary: any, destination: DestinationConfig, lang: SupportedLang): any {
    return {
      ...itinerary,
      destinationCity: destination.canonicalName,
      mapRegion: destination.mapRegion,
      hotel: {
        name: destination.hotel.name,
        address: destination.hotel.address,
        description: destination.hotel.descriptions[lang] || destination.hotel.descriptions.vi,
        mapUrl: destination.hotel.mapUrl,
      },
      summary: itinerary?.summary || this.getDefaultSummary(lang, destination),
    };
  }

  private parseTextToItinerary(
    content: string,
    lang: SupportedLang,
    numDays: number,
    destination: DestinationConfig,
  ): any {
    console.log('Using fallback parser for incomplete JSON');

    const extractedDays: any[] = [];
    const dayPattern = /"day"\s*:\s*(\d+)[^}]*"title"\s*:\s*"([^"]*)"[^}]*"activities"\s*:\s*\[([\s\S]*?)(?:\]|\}\s*,\s*\{)/g;

    let dayMatch;
    while ((dayMatch = dayPattern.exec(content)) !== null) {
      const dayNum = parseInt(dayMatch[1], 10);
      const dayTitle = dayMatch[2];
      const activitiesStr = dayMatch[3];
      const activities: any[] = [];
      const actRegex = /\{\s*"time"\s*:\s*"([^"]*)"\s*,\s*"title"\s*:\s*"([^"]*)"\s*,\s*"description"\s*:\s*"([^"]*)"\s*,\s*"location"\s*:\s*"([^"]*)"/g;

      let actMatch;
      while ((actMatch = actRegex.exec(activitiesStr)) !== null) {
        activities.push({
          time: actMatch[1],
          title: actMatch[2],
          description: actMatch[3],
          location: actMatch[4],
          icon: 'bi-geo-alt',
        });
      }

      extractedDays.push({
        day: dayNum,
        title: dayTitle,
        activities,
      });
    }

    const summaryMatch = content.match(/"summary"\s*:\s*"([^"]*)"/);
    const summary = summaryMatch ? summaryMatch[1] : this.getDefaultSummary(lang, destination);

    return {
      days: this.normalizeDays(extractedDays, numDays, lang),
      hotel: {
        name: destination.hotel.name,
        address: destination.hotel.address,
        description: destination.hotel.descriptions[lang] || destination.hotel.descriptions.vi,
        mapUrl: destination.hotel.mapUrl,
      },
      summary,
      destinationCity: destination.canonicalName,
      mapRegion: destination.mapRegion,
    };
  }

  private getDayTitle(dayNum: number, lang: SupportedLang): string {
    const titles: Record<SupportedLang, string> = {
      vi: `Ngày ${dayNum}`,
      en: `Day ${dayNum}`,
      ko: `${dayNum}일차`,
      zh: `第${dayNum}天`,
      ru: `День ${dayNum}`,
      hi: `दिन ${dayNum}`,
    };

    return titles[lang] || titles.vi;
  }

  private getDefaultSummary(lang: SupportedLang, destination: DestinationConfig): string {
    return destination.summaries[lang] || destination.summaries.vi;
  }
}
