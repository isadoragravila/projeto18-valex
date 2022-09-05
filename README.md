# Valex

### Rota: POST ```/cards/create/:employeeId```
  - **Função**: Empresa cria novos cartões físicos para os funcionários.
  - Rota autenticada com um header http do tipo **"x-api-key"**
  - **Params:** 
  
  ``` employeeId: identificador do funcionário (number) ```
  
  - **Request:** body no formato:
  ```json
{
    "type": "groceries" //strings válidas: groceries, restaurant, transport, education, health
}
```
  - **Retorno:**
```json
{
    "number": "5472974396484296", 
    "cardholderName": "FULANO R SILVA", 
    "expirationDate": "09/27", 
    "securityCode": "890"
}
```

### Rota: POST ```/card/activate/:employeeId/:cardId```
  - **Função**: Funcionários ativam seus cartões, ou seja, criam uma senha.
  - **Params:** 
  
  ``` employeeId: identificador do funcionário (number)``` 
  
  ```cardId: identificador do cartão (number)```
  
  - **Request:** body no formato:
  ```json
{
    "password": "1234", //string - senha criada pelo funcionário (4 dígitos)
    "CVV": "890" //string - código de segurança do cartão que será ativado
}
```

### Rota: PUT ```/card/:action/:cardId```
  - **Função**: Funcionários podem bloquear ou desbloquear seus cartões.
  - **Params:** 
  
  ``` action: ações de bloqueio ou desbloqueio (ações válidas: 'block' ou 'unblock')``` 
  
  ```cardId: identificador do cartão (number)```
  
  - **Request:** body no formato:
  ```json
{
    "password": "1234" //string - senha do cartão (4 dígitos)
}
```

### Rota: GET ```/card/balance/:cardId```
  - **Função**: Funcionários podem visualizar os saldos e transações do cartão.
  - **Params:** 
  
  ``` cardId: identificador do cartão (number) ```
  - **Retorno:**
```json
{
  "balance": 35000,
  "transactions": [
		{ "id": 1, "cardId": 1, "businessId": 1, "businessName": "DrivenEats", "timestamp": "22/01/2022", "amount": 5000 }
	]
  "recharges": [
		{ "id": 1, "cardId": 1, "timestamp": "21/01/2022", "amount": 40000 }
	]
}
// valores em centavos
```

### Rota: POST ```/recharge/:cardId```
  - **Função**: Empresas recarregam os cartões de seus funcionários.
  - Rota autenticada com um header http do tipo **"x-api-key"**
  - **Params:** 
  
  ```cardId: identificador do cartão (number)```
  
  - **Request:** body no formato:
  ```json
{
    "amount": 30.00 //number - valor maior que 0, em reais
}
```

### Rota: POST ```/payment/:cardId```
  - **Função**: Funcionários compram em POS em estabelecimentos do mesmo tipo que seus cartões.
  - **Params:** 
  
  ```cardId: identificador do cartão (number)```
  
  - **Request:** body no formato:
  ```json
{
    "password": "1234", //string - senha do cartão (4 dígitos)
    "businessId": 1, //number - indentificador do estabelecimento da compra
    "amount": 30.00 //number - valor maior que 0, em reais
}
```

### Rota: POST ```/online/payment```
  - **Função**: Funcionários compram online em estabelecimentos do mesmo tipo que seus cartões.
  - **Request:** body no formato:
  ```json
{
    "cardNumber":"5472974396484296", //string - numero do cartão
    "cardholderName": "FULANO R SILVA", //string - nome impresso no cartão
    "expirationDate": "09/27", //string - data de expiração do cartão no formato (MM/YY)
    "CVV": "890" //string - código de segurança do cartão
    "businessId": 1, //number - indentificador do estabelecimento da compra
    "amount": 30.00 //number - valor maior que 0, em reais
}
```

### Rota: POST ```/virtual/card/create/:cardId```
  - **Função**: Funcionários podem criar cartões virtuais vinculados aos seus cartões físicos.
  - **Params:** 
  
  ``` cardId: identificador do cartão original (number) ```
  
  - **Request:** body no formato:
  ```json
{
    "password": "1234" //string - senha do cartão original (4 dígitos)
}
```
  - **Retorno:**
```json
{
    "number": "6771-8918-4946-4413", 
    "cardholderName": "FULANO R SILVA", 
    "expirationDate": "09/27", 
    "securityCode": "095"
}
```

### Rota: DELETE ```/virtual/card/delete/:cardId```
  - **Função**: Funcionários podem excluir seus cartões virtuais.
  - **Params:** 
  
  ```cardId: identificador do cartão (number)```
  
  - **Request:** body no formato:
  ```json
{
    "password": "1234", //string - senha do cartão (4 dígitos)
}
```
