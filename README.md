# URL Shortener Application

Effortlessly create and manage shortened URLs with LinkNow. Say goodbye to lengthy web addresses and welcome a streamlined way to share links. Whether you're looking to share content, track clicks, or simply make URLs more manageable, our application has you covered. Experience convenience, simplicity, and efficient link sharing in one place.

Explore the features of the URL Shortener Application, from generating QR codes to toggling between light and dark themes. Get started today and unlock the power of concise, easy-to-share URLs.

## Table of Contents

- [URL Shortener Application](#url-shortener-application)
  - [Table of Contents](#table-of-contents)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Running the Application](#running-the-application)
    - [Environment Variables](#environment-variables)
    - [Testing the Application](#testing-the-application)
  - [Wireframe](#wireframe)
  - [Features](#features)
    - [Shorten a URL](#shorten-a-url)
    - [Manage Your URLs](#manage-your-urls)
    - [Styling](#styling)
    - [QR Code Generation](#qr-code-generation)
  - [Contribution](#contribution)
  - [License](#license)

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- NPM (Node Package Manager)

### Installation

1. Clone this repository to your local machine.
2. Navigate to the project's root directory in your terminal.

```bash
git clone https://github.com/jeraldlyh/url-shortener.git
cd url-shortener
```

3. Install the project's dependencies using NPM

```bash
cd web && npm i
cd ../backend && npm i
```

### Running the Application

Run both frontend and backend API sever using `docker-compose` in the project's root directory

```bash
cd url-shortener
docker compose up
```

### Environment Variables

| Name                     | Description                     |
| ------------------------ | ------------------------------- |
| `FIRESTORE_PROJECT_ID`   | Firestore project ID            |
| `FIRESTORE_PRIVATE_KEY`  | Firestore private key           |
| `FIRESTORE_CLIENT_EMAIL` | Firestore client email          |
| `AUTH_SECRET`            | JWT secret key                  |
| `AUTH_SALT_ROUNDS`       | Cost refactor to calculate hash |

Access the application by opening your web browser and navigating to `http://localhost:3000`

### Testing the Application

The application includes unit tests to ensure its functionality and reliability.

```bash
npm test
```

## Wireframe

The wireframe of the project can be found [here](https://www.figma.com/file/f9iTtOX5iZpeqk1uS1OhmD/Govtech-DCube?type=design&node-id=1%3A65&mode=design&t=IhvVEU0WzCIelBHp-1) on Figma.

## Features

### Shorten a URL

1. In the frontend application, open up the modal via the add button
2. Enter the URL you want to shorten in the provided input field.
3. You may choose to specify a alias or generate a QR code while creating the shortened URL
4. Click the _"Create"_ button.
5. The shortened URL will be displayed on the screen. You can now easily share this URL with others via a link or QR code.

### Manage Your URLs

1. Login to your account using your username and password.
2. Once logged in, you will be directed to your user panel.
3. Here, you can:
   - View the list of URLs you have previously shortened.
   - Add new URLs to your list.
   - Delete URLs from your list.

### Styling

Experience modern aesthetics with customizable themes. Toggle between a dark theme and the captivating dracula theme. The application is designed to be fully responsive, ensuring seamless usability across devices.

### QR Code Generation

For added convenience, the application allows you to generate QR codes for your shortened URLs. Simply click the _"Download"_ button next to the URL you want to generate a QR code for. The QR code can be downloaded in either PNG or SVG format.

## Contribution

We welcome contributions to enhance the LinkNow platform. Whether you're a developer, designer, or community advocate, your contributions are valuable in making neighborhoods safer and more connected.

**Bug Fixes**: Help us identify and resolve bugs to improve user experience.

**Feature Enhancements**: Add new features that contribute to community engagement and safety.

**Documentation**: Improve existing documentation or create guides for newcomers.

**Feedback**: Share your ideas and suggestions to shape the platform's future.

## License

LinkNow - Tiny URLs Big Impact is released under the [MIT License](LICENSE).
