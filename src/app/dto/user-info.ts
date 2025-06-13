export class UserInfo{
    constructor(
        public sub: string,
        public name: string,
        public given_name: string,
        public family_name: string,
        public picture: string,
        public email: string,
        public email_verified: boolean,
        public locale: string
    ){}
}