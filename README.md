# naver-land-crawler

---

## 사용 API

### [Naver 부동산 Cluster API](./src/modules/naver-land-client/clients/cluster/readme.md)

네이버 부동산 매물 목록을 조회할 때 사용할 Cluster API

### [Naver 부동산 Front API](./src/modules/naver-land-client/clients/front/readme.md)

네이버 부동산 매물의 정보를 상세하게 조회할 수 있는 Front API

### [Kakao Local Geo API](./src/modules/kakao-client/geo/readme.md)

위도/경도 좌표를 주소 정보로 변환할 수 있는 Kakao Local Geo API

---

## 주요 모듈

### [scheduler](./src/modules/scheduler)

일정 주기로 네이버 부동산 매물 조회 요청을 하는 스케줄링 모듈

### [coord2address](./src/modules/coord2address/coord2address.module.ts)

Kakao API를 활용해서 위도/경도의 주소를 조회해서 DB로 적재하고 조회할 수 있는 모듈

### [crawler](./src/modules/crawler/crawler.module.ts)

네이버 부동산 매물 조회하고 가공하여 DB에 저장하는 모듈

#### 처리 프로세스

1. [schedule](./src/modules/scheduler/schedules/schedule.ts)을 통해 일정 주기마다 네이버 부동산 매물 조회 요청 Job을 생성하여 큐에 적재합니다. (NaverLandQueue.CrawlingArticles 타입의 Job 생성)
2. [네이버 부동산 매물 조회 Processor](./src/modules/crawler/processors/crawling-article.processor.ts)에서 요청된 지역의 매물을 조회하고, 필요에 따라 매물의 연관 키 정보, 매물의 정보, 단지 정보 등을 추가로 조회합니다.<br />
   이후 매물 정보를 가공하는 Job을 생성하여 큐에 적재합니다. (NaverLandQueue.ArticleTransform 타입의 Job 생성)
3. [네이버 부동산 매물 정보를 가공해서 저장하는 Processor](./src/modules/crawler/processors/article-transform.processor.ts)에서 매물 정보를 가공하여 DB에 저장합니다. <br/>
   만약 신규 매물이나 주소 정보가 존재하지 않는 매물인 경우 위도/경도 좌표를 주소로 변환하는 Job을 생성하여 큐에 적재합니다.
4. [위도/경도 좌표를 주소로 변환하는 Processor](./src/modules/crawler/processors/coord-to-address.processor.ts)에서 위도/경도 좌표를 Kakao API를 이용해서 주소 정보로 변환한 다음 매물 정보를 업데이트 합니다.