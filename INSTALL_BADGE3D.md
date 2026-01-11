# Instalação do Sistema de Badges 3D

## Dependências Necessárias

Para que o sistema de badges 3D funcione, você precisa instalar as seguintes bibliotecas:

```bash
npm install @react-three/fiber @react-three/drei three
```

## Problema com PowerShell

Se você receber o erro `UnauthorizedAccess` ao tentar rodar npm, execute um dos seguintes comandos:

### Opção 1: Usar cmd.exe
Abra o cmd (Prompt de Comando) e rode:
```bash
cd c:\Users\PICHAU\Desktop\taskquest
npm install @react-three/fiber @react-three/drei three
```

### Opção 2: Alterar Policy do PowerShell (Requer Admin)
No PowerShell como Administrador:
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

Depois rode o npm install normalmente.

### Opção 3: Usar Git Bash / WSL
Se você tem Git Bash ou WSL instalado, pode usá-los para rodar o comando npm.

## Verificação

Após instalação bem-sucedida, o servidor dev já deve exibir os badges 3D automaticamente!

Você verá badges incríveis que evoluem conforme o nível:
- **Bronze/Iron** (níveis 1-20)
- **Silver** (níveis 21-35)
- **Gold** (níveis 36-50)
- **Platinum** (níveis 51-70)
- **Diamond** (níveis 71-90)
- **Mythic** (níveis 91-120)
- **Celestial** (níveis 121-160)
- **Divine** (níveis 161-200)
- **Transcendent** (níveis 200+) - com progressão infinita!
