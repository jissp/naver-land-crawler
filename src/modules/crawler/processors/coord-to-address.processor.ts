import { Job } from 'bull';
import { OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Coord2addressService } from '@modules/coord2address';
import { NaverLandQueue, NaverLandQueueJobData } from '@modules/crawler-queue';
import { ArticleService } from '@modules/article';

type JobData = NaverLandQueueJobData<NaverLandQueue.CoordinateToAddress>;

/**
 * 네이버 부동산 매물의 위도/경도 값을 주소로 변환하여 매물 정보를 업데이트하는 프로세서
 */
@Processor(NaverLandQueue.CoordinateToAddress)
export class CoordToAddressProcessor {
    constructor(
        private readonly coord2addressServce: Coord2addressService,
        private readonly articleService: ArticleService,
    ) {}

    @Process()
    async onProcess(job: Job<JobData>) {
        const { articleNo, latitude, longitude } = job.data;

        const address = await this.coord2addressServce.findByCoordWithCollect({
            lat: latitude,
            lng: longitude,
        });

        await this.articleService.updateAddress(articleNo, {
            address: address.data.address.address_name,
            region1: address.data.address.region_1depth_name,
            region2: address.data.address.region_2depth_name,
            region3: address.data.address.region_3depth_name,
        });
    }

    // @OnQueueCompleted()
    // async onCompleted(job: Job<JobData>, result: any) {
    //     // console.log(`${NaverLandCrawlerQueueType.TransformArticle} completed`);
    // }

    @OnQueueFailed()
    async onFailed(job: Job<JobData>, e: any) {
        console.log(e);
    }
}
