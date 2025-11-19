# 네이버 부동산 매물 수집을 위한 비즈니스 로직을 관리하는 모듈

## 비동기 프로세서

### CrawlingArticles

네이버 부동산 매물을 조회하는 프로세서

### ArticleTransform

네이버 부동산 매물 Article 정보를 가공해서 DB에 저장하는 프로세서

### CoordinateToAddress

네이버 부동산 매물의 위도/경도 값을 주소로 변환하여 매물 정보를 업데이트하는 프로세서