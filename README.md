# react-canvas-framework (Em desenvolvimento)

O ***`react-canvas-framework`*** é uma estrutura abrangente que facilita a criação de interfaces de usuário complexas e interativas com canvas em ReactJS. O módulo fornece:

- **Componentes prontos para usar**: Uma biblioteca de componentes canvas pré-construídos e personalizáveis, como gráficos, animações, jogos e ferramentas de desenho.
- **Sistema de layout flexível**: Uma maneira de organizar e estruturar seus componentes canvas de forma intuitiva e responsiva.
- **API poderosa**: Uma interface de programação robusta que permite interagir com seus componentes canvas e controlar seu comportamento.
- **Integração perfeita com React**: Uma experiência de desenvolvimento perfeita que se integra seamlessly com o React e seus outros componentes.

Em resumo, ***`react-canvas-framework`*** sugere:

- **Abstração**: Uma camada de abstração que facilita o uso de canvas em React, ocultando a complexidade da API canvas nativa.
- **Flexibilidade**: Uma estrutura flexível que se adapta às suas necessidades e permite criar interfaces de usuário canvas complexas e personalizadas.
- **Poder**: Uma API poderosa que oferece controle total sobre seus componentes canvas e permite criar experiências interativas e envolventes.
- **Comunidade**: Uma comunidade vibrante de desenvolvedores que contribuem para o módulo e oferecem suporte e orientação.

## Índice

- [react-canvas-framework (Em desenvolvimento)](#react-canvas-framework-em-desenvolvimento)
  - [Índice](#índice)
  - [Instalação](#instalação)
  - [Uso](#uso)
  - [Documentação](#documentação)
    - [Context](#context)
      - [Props](#props)
      - [Exemplo](#exemplo)
    - [Group](#group)
      - [Props](#props-1)
      - [Exemplo](#exemplo-1)
    - [Line](#line)
      - [Props](#props-2)
      - [Exemplo](#exemplo-2)
    - [`ref`](#ref)
      - [Props](#props-3)
      - [Exemplo](#exemplo-3)

## Instalação

```bash
npm install react-canvas-framework
```

## Uso

```tsx
import React from 'react';
import { Context, Rect } from 'react-canvas-framework';

const App: React.FC = () => {
  return (
    <Context width={400} height={400} type="2d">
      <Rect x={50} y={50} width={100} height={100} fill="red" />
    </Context>
  );
};
```

## Documentação

### Context

O componente `Context` é o componente raiz da sua aplicação canvas. Ele é responsável por criar o contexto de renderização e gerenciar os componentes filhos.

#### Props

- `width`: A largura do contexto de renderização.
- `height`: A altura do contexto de renderização.
- `type`: O tipo de contexto de renderização (2d ou 3d).
- `children`: Os componentes filhos a serem renderizados.
- `onUpdate`: O callback de atualização do contexto de renderização.
- `onRender`: O callback de renderização do contexto de renderização.
- `onDestroy`: O callback de destruição do contexto de renderização.
- `onError`: O callback de erro do contexto de renderização.

#### Exemplo

```tsx
import React from 'react';
import { Context, Rect } from 'react-canvas-framework';

const App: React.FC = () => {
  return (
    <Context width={400} height={400} type="2d">
      <Rect x={50} y={50} width={100} height={100} fill="red" />
    </Context>
  );
};
```

### Group

O componente `Group` é um container de componentes que permite agrupar e organizar componentes filhos.

#### Props

- `x`: A posição horizontal do grupo.
- `y`: A posição vertical do grupo.
- `children`: Os componentes filhos a serem agrupados.
- `...GlobalSettingsStyled`: As propriedades de estilo globais do canvas.

#### Exemplo

```tsx
import React from 'react';
import { Context, Group, Rect } from 'react-canvas-framework';

const App: React.FC = () => {
  return (
    <Context width={400} height={400} type="2d">
      <Group x={50} y={50}>
        <Rect x={0} y={0} width={100} height={100} fill="red" />
        <Rect x={100} y={0} width={100} height={100} fill="green" />
      </Group>
      <Rect x={200} y={0} width={100} height={100} fill="blue" />
    </Context>
  );
};
```

### Line

O componente `Line` é um componente de linha que permite desenhar linhas retas no canvas.

#### Props

- `x1`: A posição horizontal do ponto inicial da linha.
- `y1`: A posição vertical do ponto inicial da linha.
- `x2`: A posição horizontal do ponto final da linha.
- `y2`: A posição vertical do ponto final da linha.
- `...GlobalSettingsStyled`: As propriedades de estilo globais do canvas.

#### Exemplo

```tsx
import React from 'react';
import { Context, Line } from 'react-canvas-framework';

const App: React.FC = () => {
  return (
    <Context width={400} height={400} type="2d">
      <Line x1={50} y1={50} x2={150} y2={150} stroke="red" />
    </Context>
  );
};
```

### `ref`

O ***`react-canvas-framework`*** também suporta o uso de referências para acessar e controlar os componentes canvas.

```tsx
import React, { useRef } from 'react';
import Canvas, { Context, Rect } from 'react-canvas-framework';

const App: React.FC = () => {
  const rectRef = useRef<Canvas.CANVASRectElement|null>(null);

  return (
    <Context width={400} height={400} type="2d">
      <Rect ref={rectRef} x={50} y={50} width={100} height={100} fill="red" />
    </Context>
  );
};
```

Com a referência, você pode acessar e controlar as propriedades do componente canvas diretamente e de forma otimizada, sem ter que se preocupar em de renderização.

#### Props

- `setAttribute(propName: string, value: any)`: Define uma propriedade do componente canvas.
- `getAttribute(propName: string)`: Obtém uma propriedade do componente canvas.
- `update(props: Partial<Canvas.CANVASRectProps>)`: Atualiza as propriedades do componente canvas.
- `toString()`: Obter uma string JSON com todas as propriedades do componente canvas.

#### Exemplo

```tsx
import React, { useRef } from 'react';
import Canvas, { Context, Rect } from 'react-canvas-framework';

const App: React.FC = () => {
  const rectRef = useRef<Canvas.CANVASRectElement|null>(null);

  const handleClick = () => {
    rectRef.current.setAttribute("fill", 'blue');

    const transform = rectRef.current.getAttribute("transform");
    transform.translate.x += 10;

    rectRef.current.setAttribute("transform", transform);

    rectRef.current.update((props)=> {
        return {...props, width: 50};
    });
  };

  return (
    <Context width={400} height={400} type="2d">
      <Rect ref={rectRef} x={50} y={50} width={100} height={100} fill="red" onClick={handleClick} />
    </Context>
  );
};
```