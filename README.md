
<a name="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
<!-- [![MIT License][license-shield]][license-url] -->


<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/AlgoBattles/algobattles-next-app">
    <!-- <img src="images/logo.png" alt="Logo" height="200"> -->
  </a>

<h3 align="center">AlgoBattles</h3>

  <p align="center">
    A platform for head to head algorithm competition. 
    <br />
    <br />
    <a href="https://github.com/AlgoBattles/algobattles-next-app/issues">Report Bug</a>
    ·
    <a href="https://github.com/AlgoBattles/algobattles-next-app/issues">Request Feature</a>
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
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>


<!-- GETTING STARTED -->
## Getting Started

AlgoBattles is comprised of: 
1. A Next.js frontend (this repo) 
2. Supabase for user management/auth & postgres instance to persist game invites and game state
3. A socket server for realtime gameplay and remote code execution engine to execute user code [another repo pending relese]


### Prerequisites

1. Set up an account on [Supabase][Supabase-url]

2. Create tables for for users, algos, invites, and battle state

```sql
CREATE TABLE users (
    email TEXT,
    username TEXT,
    avatar TEXT,
    preferred_language TEXT,
    user_id TEXT PRIMARY KEY
);
```

```sql
CREATE TABLE algos (
    id BIGINT PRIMARY KEY,
    prompt TEXT,
    func_name TEXT,
    template_code TEXT,
    test_cases_json JSONB,
    python_template TEXT
);
```

```sql
CREATE TABLE invites (
    id BIGINT PRIMARY KEY,
    created_at TIMESTAMPTZ,
    sender_id UUID,
    recipient_id UUID,
    sender_ready BOOLEAN,
    recipient_ready BOOLEAN
);
```

```sql
CREATE TABLE battles (
    id BIGINT PRIMARY KEY,
    created_at TIMESTAMPTZ,
    algo_id INT,
    user1_id UUID,
    user2_id UUID,
    user1_code TEXT,
    user2_code TEXT,
    user1_progress INT,
    user2_progress INT,
    algo_prompt TEXT,
    func_name TEXT,
    template_code TEXT,
    test_cases_json JSONB,
    user1_results JSONB,
    user2_results JSONB,
    battle_active BOOLEAN,
    battle_winner TEXT
);
```


3. Clone and run the RCE/Socket server (repo pending release)


### Installation

1. Install dependencies
   ```sh
   npm install
   ```

2. Run in development
   ```sh
   npm run dev
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- USAGE EXAMPLES -->
## Screenshots

<img src="public/screenshots/screenshot1.png" alt="Logo" height="400">
<br />
<img src="public/screenshots/screenshot1pt5.png" alt="Logo" height="400">
<br />
<img src="public/screenshots/screenshot5.png" alt="Logo" height="400">
<br />
<img src="public/screenshots/screenshot6.png" alt="Logo" height="400">

<img src="public/screenshots/screenshot7.png" alt="Logo" height="400">




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

See the [open issues](https://github.com/WatchDogCLI/WatchDog/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Oliver Wendell-Braly - [@linkedIn](https://www.linkedin.com/in/oliverbraly/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS
## Acknowledgments

* []()
* []()
* []() -->

<!-- <p align="right">(<a href="#readme-top">back to top</a>)</p> -->



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/AlgoBattles/algobattles-next-app.svg?style=for-the-badge
[contributors-url]: https://github.com/AlgoBattles/algobattles-next-app/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/AlgoBattles/algobattles-next-app.svg?style=for-the-badge
[forks-url]: https://github.com/AlgoBattles/algobattles-next-app/network/members
[stars-shield]: https://img.shields.io/github/stars/AlgoBattles/algobattles-next-app.svg?style=for-the-badge
[stars-url]: https://github.com/AlgoBattles/algobattles-next-app/stargazers
[issues-shield]: https://img.shields.io/github/issues/AlgoBattles/algobattles-next-app.svg?style=for-the-badge
[issues-url]: https://github.com/AlgoBattles/algobattles-next-app/issues
[license-shield]: https://img.shields.io/github/license/AlgoBattles/algobattles-next-app.svg?style=for-the-badge
[license-url]: https://github.com/AlgoBattles/algobattles-next-app/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/linkedin_username
[product-screenshot]: images/screenshot.png
[minikube]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB 
[Minikube-url]: https://minikube.sigs.k8s.io/
[Docker-url]: https://www.docker.com/
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[Laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[Laravel-url]: https://laravel.com
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com 
[supabase-url]: https://supabase.com/