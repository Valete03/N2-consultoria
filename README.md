# Diagnóstico N2

Aplicação web de diagnóstico estratégico em 5 etapas, baseada no briefing fornecido.

## Ficheiros

- `index.html` — interface
- `style.css` — design responsivo
- `app.js` — lógica, validação, Firebase Firestore e WhatsApp

## Como usar

1. Coloque os três ficheiros na mesma pasta.
2. Abra a pasta através de um servidor local (recomendado), por exemplo VS Code Live Server.
3. A aplicação já contém a configuração Firebase indicada no briefing.
4. No Firebase Console, confirme que o Firestore está criado e que as regras permitem a gravação de documentos na coleção `leads_qualificados`.

## Coleção

`leads_qualificados`

Os documentos guardam as respostas do diagnóstico, dados de contacto e `timestamp` com `serverTimestamp()`.

## WhatsApp

O botão final utiliza o número `+258879217234` e gera uma mensagem personalizada com nome, empresa, gargalo e objetivo.

## Nota de segurança

A configuração Firebase usada no frontend contém uma chave de API pública, como é normal em aplicações web Firebase. A segurança real deve ser feita pelas Firestore Security Rules e pela configuração correta do projeto.
