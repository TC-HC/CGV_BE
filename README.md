# CGV_BE

하나의 활동을 하나의 블록으로 저장, 섹션 단위 정리, Drag & Drop 순서 변경, 섹션 간 블록 이동, 프로필 디자인 타입, 링크 공유용 공개 조회 API.

## 주요 기능

- CV 프로필 생성/조회/수정/삭제
- 기본형/개발자형/디자이너형/과학자형 프로필 타입 저장
- 리스트/타임라인 보기 모드 저장
- 섹션 생성, 카테고리 관리, 섹션 순서 변경
- 활동/성과/프로젝트/학습 블록 생성, 수정, 삭제
- 같은 섹션 내 블록 순서 변경
- 다른 섹션으로 블록 이동하여 상위 요소 재할당
- 공유 링크용 `shareSlug` 기반 공개 CV 조회
- 블록별 공개 여부 `isPublic`
- Swagger API 문서 제공

## 기술 스택

- NestJS
- Prisma
- PostgreSQL
- Swagger/OpenAPI

## 실행 방법

### Docker로 실행

로컬에 Node.js/npm이 없어도 Docker만 설치되어 있으면 BE와 PostgreSQL을 함께 실행할 수 있습니다.

```bash
docker compose up --build
```

위 명령은 `CGV_BE` 폴더에서 실행합니다. 컨테이너 시작 시 Prisma Client 생성과 migration 반영을 자동으로 수행합니다.

서버가 실행되면 기본 주소는 `http://localhost:3000`이고, Swagger 문서는 `http://localhost:3000/api`에서 확인할 수 있습니다.

중지:

```bash
docker compose down
```

DB 데이터까지 초기화하려면:

```bash
docker compose down -v
```

### 로컬 npm으로 실행

```bash
npm install
```

`.env.example`을 참고해 `.env` 파일을 만들고 PostgreSQL 연결 문자열을 설정합니다. 기본 로컬 개발값은 이미 `.env`에 들어 있습니다.

```env
NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/cgv?schema=public"
CORS_ORIGIN="http://localhost:5173"
SWAGGER_PATH="api"
```

Prisma Client 생성 및 DB 반영:

```bash
npx prisma generate
npx prisma migrate dev
```

개발 서버 실행:

```bash
npm run start:dev
```

서버가 실행되면 기본 주소는 `http://localhost:3000`입니다.

## Swagger API 문서

Swagger 문서는 서버 실행 후 아래 주소에서 확인할 수 있습니다. 경로는 `SWAGGER_PATH`로 바꿀 수 있습니다.

```text
http://localhost:3000/api
```

## 데이터 구조

FE의 상태 구조와 맞춰 `User -> Section -> Block` 형태로 저장합니다.

- `User`: 프로필 헤더 정보, 디자인 타입, 보기 모드, 공유 slug
- `Section`: 섹션명, 카테고리, 섹션 순서
- `Block`: 블록 타입, 순서, 제목, 기간, 역할, 요약, 상세 설명, 수상 결과, 인증 링크/이미지, 스택, 참고 링크, 학습 타입, 이모지, 공개 여부

블록 타입은 FE와 동일하게 아래 값을 사용합니다.

```text
activity | achievement | project | learning
```

## 주요 API

### 데모 CV 생성

FE 목데이터와 유사한 프로필/섹션/블록을 한 번에 생성합니다.

```http
POST /users/demo
```

### CV 프로필 조회

```http
GET /users/:id
```

응답은 FE가 바로 쓰기 쉬운 중첩 구조입니다.

```json
{
  "id": 1,
  "name": "홍길동",
  "profileType": "dev",
  "viewMode": "list",
  "shareSlug": "uuid",
  "sections": [
    {
      "id": 1,
      "title": "프로젝트",
      "category": "개발",
      "order": 0,
      "blocks": [
        {
          "id": 1,
          "type": "project",
          "title": "CV Block 플랫폼",
          "stack": "React · NestJS · PostgreSQL",
          "role": "백엔드 개발",
          "summary": "이력서를 블록 단위로 구성하는 플랫폼 개발",
          "order": 0
        }
      ]
    }
  ]
}
```

### 섹션 생성

```http
POST /sections/users/:userId
Content-Type: application/json

{
  "title": "대외 활동",
  "category": "개발"
}
```

### 블록 생성

```http
POST /blocks/sections/:sectionId
Content-Type: application/json

{
  "type": "activity",
  "title": "Infoteam 롱커톤 참여",
  "period": "2024.03 - 2024.12",
  "role": "운영진 / 백엔드",
  "summary": "전국 대학생 IT 창업 동아리에서 백엔드 개발 및 운영 담당",
  "detail": "Django REST Framework 기반 API 서버 설계"
}
```

### 섹션 내부 블록 순서 변경

```http
PATCH /sections/:id/blocks/reorder
Content-Type: application/json

{
  "blockIds": [3, 1, 2]
}
```

### 블록을 다른 섹션으로 이동

```http
PATCH /blocks/:id/move
Content-Type: application/json

{
  "targetSectionId": 2,
  "order": 0
}
```

### 공유 링크용 공개 CV 조회

```http
GET /users/share/:shareSlug
```

`User.isPublic=false`이면 조회되지 않고, `Block.isPublic=false`인 블록은 공유 응답에서 제외됩니다.

## FE 연동 기준

FE는 최초 진입 시 `GET /users/:id` 또는 `GET /users/share/:shareSlug`로 전체 CV를 받고, 이후 사용자 조작마다 아래 API를 호출하면 됩니다.

- 블록 추가: `POST /blocks/sections/:sectionId`
- 블록 수정: `PATCH /blocks/:id`
- 블록 삭제: `DELETE /blocks/:id`
- 블록 순서 변경: `PATCH /sections/:id/blocks/reorder`
- 블록 섹션 이동: `PATCH /blocks/:id/move`
- 섹션 추가: `POST /sections/users/:userId`
- 섹션 수정: `PATCH /sections/:id`
- 섹션 순서 변경: `PATCH /sections/users/:userId/reorder`
- 프로필/디자인/타임라인 모드 수정: `PATCH /users/:id`

## 테스트

```bash
npm run build
npm run test
```
