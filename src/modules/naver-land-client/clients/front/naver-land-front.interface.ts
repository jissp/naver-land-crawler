import {
    BuildingConjunctionDateType,
    BuildingType,
    DirectionType,
    FacilityEtcType,
    FacilityLifeType,
    FacilitySecurityType,
    HeatingAndCoolingSystemType,
    HeatingEnergyType,
    LoanTypeCode,
    MovingType,
    RealEstateTypeCode,
    ResidenceType,
    TradeType,
    VerificationType,
} from '../../naver-land-client.interface';

export enum FrontApiOperationId {
    ArticleKey = 'ArticleKey',
    ArticleBasicInfo = 'ArticleBasicInfo',
    Complex = 'Complex',
}

export type FrontApiResult<T extends FrontApiOperationId> =
    T extends FrontApiOperationId.ArticleKey
        ? ArticleKeyResult
        : T extends FrontApiOperationId.ArticleBasicInfo
          ? ArticleBasicInfoResult
          : T extends FrontApiOperationId.Complex
            ? ComplexResult
            : never;

interface ArticleBasicInfoResult {
    priceInfo?: {
        price: number;
        previousDeposit: number;
        previousMonthlyRent: number;
        loan: number;
        loanCode: string;
        loanTypeCode?: LoanTypeCode;
    };
    detailInfo?: {
        facilityInfo: {
            life: FacilityLifeType[];
            security: FacilitySecurityType[];
            etc: FacilityEtcType[];
            buildingConjunctionDateType?: BuildingConjunctionDateType;
            buildingConjunctionDate?: string;
            approvalElapsedYear?: number;
            entranceType: string;
            heatingAndCoolingSystemType?: HeatingAndCoolingSystemType;
            heatingEnergyType?: HeatingEnergyType;
            totalParkingCount?: number;
            parkingCountPerHousehold?: number;
            structure?: any;
            householdNumber?: number;
        };
        articleDetailInfo: {
            articleNumber: number;
            articleName: string;
            nonComplexBuildingName?: string;
            nonComplexBuildingSubName?: string;
            articleFeatureDescription?: string;
            articleDescription?: string;
            isAddressExposed: boolean;
            isJibunAddressExposed?: boolean;
            isDirectTrade: boolean;
            directTradeOwnerCellPhoneNumber?: number;
            buildingType?: BuildingType;
            cpId: string;
            exposureStartDate: string;
            buildingUse: string;
            buildingPrincipalUse?: string;
        };
        movingInInfo: {
            movingInNegotiation?: boolean;
            movingInDate?: string;
            movingInMonth?: string;
            movingInType?: MovingType;
            contractPeriod?: null;
        };
        verificationInfo: {
            verificationType?: VerificationType;
            isAssociationArticle?: boolean;
            exposureStartDate?: string;
        };
        spaceInfo: {
            floorInfo: {
                targetFloor?: string;
                totalFloor?: string;
                groundTotalFloor?: string;
                undergroundTotalFloor?: string;
                floorType?: string;
                residenceType?: ResidenceType;
            };
            roomCount?: number;
            bathRoomCount?: number;
            direction?: DirectionType;
            duplex?: boolean;
            directionStandard?: string;
        };
        sizeInfo: {
            supplySpace?: number;
            exclusiveSpace?: number;
            supplySpaceName?: string;
            exclusiveSpaceName?: string;
            floorAreaRatio?: number;
            buildingCoverageRatio?: number;
            pyeongArea?: number;
        };
    };
    communalComplexInfo?: {
        complexNumber: number;
        complexName: string;
        pyeongTypeNumber?: number;
        dongName?: string;
    };
}

interface ArticleKeyResult {
    key?: {
        complexNumber?: number | null;
        pyeongTypeNumber?: number | null;
        buildingNumber?: number | null;
        hoNumber?: number | null;
        redevelopmentAreaNumber?: number | null;
        pnu?: number | null;
    };
    type?: {
        realEstateType: RealEstateTypeCode;
        tradeType: TradeType;
    };
    address?: {
        legalDivisionNumber?: string;
        jibun?: string;
        li?: null;
    };
    isRealEstateAssociationArticle?: boolean;
    isArticleImageExist?: boolean;
}

interface ComplexResult {
    name: string;
    type: RealEstateTypeCode;
    address: {
        legalDivisionNumber: string;
        legalDivisionLevel: string;
        legalDivision: string;
        city: string;
        division: string;
        sector: string;
        jibun: string;
        roadName: string;
        zipCode: string;
    };
    coordinates: { xcoordinate: number; ycoordinate: number };
    photos: [];
    totalHouseholdNumber: number;
    leaseHouseholdNumber: number;
    dongCount: number;
    hasBuildingHoInfo: true;
    constructionCompany: string;
    buildingUse: null;
    isServicedResidence: false;
    buildingRatioInfo: {
        floorAreaRatio: number;
        buildingCoverageRatio: number;
    };
    useApprovalDate: string;
    approvalElapsedYear: number;
    parkingInfo: {
        totalParkingCount: number;
        parkingCountPerHousehold: number;
    };
    heatingAndCoolingInfo: {
        heatingAndCoolingSystemType: HeatingAndCoolingSystemType;
        heatingEnergyType: HeatingEnergyType;
    };
    managementOfficeContact?: null;
    monopolyRestrictionType: 'N';
    isRestrictedTransferOfReconstructionAssociationMembership: boolean;
}
