export class ErrorCode {
  static readonly UNAUTHORIZE = "ERR00007";
  static readonly DATA_IS_EXISTS: string = "ERR00008";
  static readonly PASSWORD_NOT_MATCHED: string = "ERR00009";
  static readonly DATA_NOT_FOUND: string = "ERR00010";
  static readonly EMAIL_IS_EXISTS: string = "ERR00011";
  static readonly EMAIL_DOES_NOT_EXISTS: string = "ERR00012";
  static readonly SOME_THING_WENT_WRONG: string = "ERR00038";
  static readonly INCORRECT_OTP_CODE: string = "ERR00039";
  static readonly INCORRECT_EMAIL_OR_PASSWORD: string = "ERR00040";
  static readonly PASSWORD_IS_NOT_CORRECT: string = "ERR00041";
  static readonly ACCESS_DENIED: string = "ERR00042";
  static readonly PASSWORD_MATCH_OLD_PASSWORD: string = "ERR00044";
  static readonly OTP_IS_EXPIRED: string = "ERR00045";
  static readonly OTP_NOT_SENT: string = "ERR00046";
}
