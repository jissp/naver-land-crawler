export class ArticleListRequestDto {
    z!: number;
    lat!: number;
    lon!: number;
    btm!: number;
    lft!: number;
    top!: number;
    rgt!: number;
    rletTpCd?: string; // APT%3AOPST
    tradTpCd?: string; // A1%3AB2
    spcMin?: number;
    spcMax?: number;
    dprcMax?: number;
    wprcMax?: number;
}
