<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<a name="readme-top"></a>

<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<!-- [![LinkedIn][linkedin-shield]][linkedin-url] -->

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <!-- <a href="https://github.com/cloak-room/server">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a> -->

<h3 align="center">CloakRoom - Client</h3>

  <p align="center">
    A client for tracking cloakroom inventory, designed to work with  <a href="https://github.com/cloak-room/server">CloakRoom - Server</a>
    <!-- <br />
    <a href="https://github.com/cloak-room/server"><strong>Explore the docs »</strong></a> -->
    <br />
    <br />
    <!-- <a href="https://github.com/cloak-room/server">View Demo</a>
    · -->
    <a href="https://github.com/cloak-room/client/issues">Report Bug</a>
    ·
    <a href="https://github.com/cloak-room/client/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

<!-- [![Product Name Screen Shot][product-screenshot]](https://example.com) -->

This app was originally intended to be used to manage inventory at mobile phone charging stations at a local music festival. In the spirit of that festival we have open-sourced the project and made it more general so that it may be reused by anyone.

The the project consists of a [client](https://github.com/cloak-room/client) written using the ionic framework and reactjs, and a REST [API](https://github.com/cloak-room/server) written with express.js

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

[![Ionic][ionic-badge]][ionic-url]
[![React][react-badge]][react-url]
[![TypeScript][typescript-badge]][typescript-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

You will need the following prerequisites to run the project successfully

- CloakRoom - Server (https://github.com/cloak-room/server)
- Node.js (https://nodejs.org/)
- pnpm (https://pnpm.io/)
<!--
  Windows (powershell):

  ```
  iwr https://get.pnpm.io/install.ps1 -useb | iex
  ```

  OSX:

  ```
  brew install pnpm
  ```

  Debian Based:

  ```sh
  sudo apt install pnpm
  ```

  Arch Based:

  ```sh
  sudo pacman -S pnpm
  ``` -->

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/cloak-room/client.git
   ```
2. Install NPM packages
   ```sh
   cd client
   pnpm install
   ```
3. Change the API proxy in package.json if necessary (the default is http://localhost:3001)
   ```json
     ...
     "proxy": "http://localhost:3001"
     ...
   ```
4. Set any necessary config options in .env
   ```shell
   # Branding info
   REACT_APP_BRANDING=CloakRoom
   ```
   <p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

Build and run the server

```
pnpm start
```

<!-- _For more examples, please refer to the [Documentation](https://example.com)_

<p align="right">(<a href="#readme-top">back to top</a>)</p> -->

<!-- ROADMAP -->

## Roadmap

<!--
- [ ] Login
- [ ] Search
  - [ ] Remove Inventory
- [ ] Add Inventory -->

See the [open issues](https://github.com/cloak-room/server/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the AGPLv3 License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Benjamin Rowe - [benjaminARowe](https://github.com/benjaminARowe)

Project Link: [https://github.com/cloak-room/client](https://github.com/cloak-room/client)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

- [Kiara Davison](https://github.com/kkdav)

Thankyou to all those who provided feedback without contributing code

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

CloakRoom Client is licensed under the AGPL 3. Copyright (C) 2023 - Benjamin Rowe, Kiara Davison & Contributors

[contributors-shield]: https://img.shields.io/github/contributors/cloak-room/client.svg?style=for-the-badge
[contributors-url]: https://github.com/cloak-room/client/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/cloak-room/client.svg?style=for-the-badge
[forks-url]: https://github.com/cloak-room/client/network/members
[stars-shield]: https://img.shields.io/github/stars/cloak-room/client.svg?style=for-the-badge
[stars-url]: https://github.com/cloak-room/client/stargazers
[issues-shield]: https://img.shields.io/github/issues/cloak-room/client.svg?style=for-the-badge
[issues-url]: https://github.com/cloak-room/client/issues
[license-shield]: https://img.shields.io/github/license/cloak-room/client.svg?style=for-the-badge
[license-url]: https://github.com/cloak-room/client/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/linkedin_username
[product-screenshot]: images/screenshot.png
[next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[next-url]: https://nextjs.org/
[react.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[react-url]: https://reactjs.org/
[vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[vue-url]: https://vuejs.org/
[angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[angular-url]: https://angular.io/
[svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[svelte-url]: https://svelte.dev/
[laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[laravel-url]: https://laravel.com
[bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[bootstrap-url]: https://getbootstrap.com
[jquery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[jquery-url]: https://jquery.com
[expressjs.com]: https://img.shields.io/static/v1?style=for-the-badge&message=Express&color=000000&logo=Express&logoColor=FFFFFF&label=
[express-url]: https://expressjs.com/
[typeorm-badge]: https://img.shields.io/badge/Express.js-404D59?style=for-the-badge
[typeorm-url]: https://expressjs.com/
[typescript-badge]: https://img.shields.io/static/v1?style=for-the-badge&message=TypeScript&color=3178C6&logo=TypeScript&logoColor=FFFFFF&label=
[typescript-url]: https://www.typescriptlang.org/
[react-badge]: https://img.shields.io/static/v1?style=for-the-badge&message=React&color=222222&logo=React&logoColor=61DAFB&label=
[react-url]: https://react.dev/
[ionic-badge]: https://img.shields.io/static/v1?style=for-the-badge&message=Ionic&color=3880FF&logo=Ionic&logoColor=FFFFFF&label=
[ionic-url]: https://ionicframework.com/
