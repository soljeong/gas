# gas

- 아무것도 없이 코드스페이스 시작했을 때 만들어진 설정

```
{"image":"mcr.microsoft.com/devcontainers/universal:2"}
```

Run the command npm install -g @google/clasp in your terminal to install clasp globally

```
clasp show-authorized-user                                     Show information about the current authorizations state.

clasp create --type sheets --title "plto"

  open-script [scriptId]                                   Open the Apps Script IDE for the current project. 브라우저에서 스크립트 편집기가 열림
  open-container                                           Open the Apps Script IDE for the current project. 브라우저에서 구글 시트가 열림


```
- pull 하면 로컬에 js파일로 저장됨
- push 하면 구글에 gs파일로 저장됨

## 앱스크립트를 로컬에서 작성

### 비밀

**"Apps Script는 비공개지만 Git 레포는 공개"**인 경우, 스크립트에 포함된 **비밀번호나 API 키 같은 비밀 값(secret)** 을 **절대 깃에 올리면 안 되잖아.** 그래서 꼭 **비밀값 관리 전략**이 필요해.



## 🔐 방법 1: **`PropertiesService`를 사용해서 비밀 저장**

```js
function setSecret() {
  PropertiesService.getScriptProperties().setProperty('MY_SECRET_KEY', '123456789');
}

function useSecret() {
  const key = PropertiesService.getScriptProperties().getProperty('MY_SECRET_KEY');
  Logger.log(key);
}
```

- 이 값은 **코드가 아니라 Apps Script 내부에 저장됨** (깃에 안 올라감)
- 설정은 IDE에서 수동으로 하거나, 별도 `setSecret()` 함수로 1회 실행

📍 저장 위치:
- `ScriptProperties` (프로젝트 전체 공유)
- `UserProperties` (유저별)
- `DocumentProperties` (시트/도큐먼트에 바인딩된 경우)

---


응! 지금 너가 쓴 방식처럼 `setProperties()`를 사용하면 **한 번에 여러 개의 프로퍼티(키-값 쌍)**을 저장할 수 있어. 완전 OK야 🙆

---

## ✅ 예시: 여러 개 프로퍼티 저장

```js
function saveSecrets() {
  PropertiesService.getDocumentProperties().setProperties({
    'apiKey': 'eee',
    'clientId': 'eeeee',
    'env': 'production'
  });
}
```

이렇게 하면 한 번에 `"apiKey"`, `"clientId"`, `"env"`가 저장돼.  
그 이후에는 이렇게 불러올 수 있어:

```js
function useSecrets() {
  const props = PropertiesService.getDocumentProperties().getProperties();
  Logger.log(props.apiKey);      
  Logger.log(props.clientId);  
}
```

---

## ℹ️ 보너스 정리

| 메서드 | 설명 |
|--------|------|
| `setProperty(key, value)` | 키-값 한 쌍 저장 |
| `setProperties(obj)` | 여러 개 한꺼번에 저장 |
| `getProperty(key)` | 키 하나 불러오기 |
| `getProperties()` | 모든 키-값 객체로 반환 |
| `deleteProperty(key)` | 특정 키 삭제 |
| `deleteAllProperties()` | 전부 삭제 |

---
