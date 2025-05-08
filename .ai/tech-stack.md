# Frontend

- Next.js z React dla komponentów interaktywnych:
- Next.js pozwala na tworzenie szybkich, wydajnych stron i aplikacji
- React 19 zapewni interaktywność tam, gdzie jest potrzebna
- Typescript 5 dla statycznego typowania kodu i lepszego wsparcia IDE
- `ant-design` zapewnia bibliotekę dostępnych komponentów React, na których oprzemy UI
- dla customowych komponentów użyjemy `styled-components`

# Backend

- Supabase jako kompleksowe rozwiązanie backendowe:
- Zapewnia bazę danych PostgreSQL
- Zapewnia SDK w wielu językach, które posłużą jako Backend-as-a-Service
- Jest rozwiązaniem open source, które można hostować lokalnie lub na własnym serwerze
- Posiada wbudowaną autentykację użytkowników

# AI

- Komunikacja z modelami przez usługę Openrouter.ai:
- Dostęp do szerokiej gamy modeli (OpenAI, Anthropic, Google i wiele innych), które pozwolą nam znaleźć rozwiązanie
  zapewniające wysoką efektywność i niskie koszta
- Pozwala na ustawianie limitów finansowych na klucze API

# Testing

- Jest jako podstawowy framework testowy:
- Zapewnia środowisko do uruchamiania testów jednostkowych, integracyjnych i end-to-end
- Obsługuje testy asynchroniczne i mocking
- Generuje raporty pokrycia kodu

- React Testing Library do testowania komponentów:
- Pozwala testować komponenty React w sposób skupiony na interakcjach użytkownika
- Promuje testowanie zachowania zamiast implementacji
- Integruje się z Jest dla pełnego doświadczenia testowego

- Mock Service Worker (MSW) do mockowania API:
- Przechwytuje rzeczywiste żądania sieciowe na poziomie sieci
- Pozwala symulować różne scenariusze odpowiedzi API bez modyfikowania kodu aplikacji
- Działa zarówno w środowisku przeglądarki jak i Node.js

# CI/CD i Hosting:

- Github Actions do tworzenia pipeline'ów CI/CD
- DigitalOcean do hostowania aplikacji za pośrednictwem obrazu docker