# *This project has been created as part of the 42 curriculum by mchanlia, tgomez-f, rchan-re and kkafmagh*

<!-- ![Docker.png](docker.png) -->

# **Program Name** : ['TheGoodCorner']

### **Short Description** : 
> This project introduces the fundamentals Docker, how Containers works and interacts with the system as a whole.  

### **Table of Content**:

|  ---  |                Section                 |         ---         |
| :---: | :------------------------------------: | :-----------------: |
|  1.   |      [Description](#description)       | :large_blue_circle: |
|  1.1  |     [Program Name](#program-name)     |   :yellow_circle:   |
|  1.2  |  [Project Summary](#project-summary-)  |   :yellow_circle:   |
|  1.3  | [Project Description](#project-description-) |   :yellow_circle:   |
|  1.4  | [Project Features](#project-features-) |   :yellow_circle:   |
|  2.   |     [Instructions](#instructions)      | :large_blue_circle: |
|  2.1  |     [Installation](#installation-)     |   :yellow_circle:   |
|  2.2  |            [Usage](#usage-)            |   :yellow_circle:   |
|  3.   |        [Resources](#resources)         | :large_blue_circle: |
  

# Description

## **Program Name**:
### TheGoodCorner

Introduction :

TheGoodCorner is a project that introduces the fundamentals of Dockerization.
Docker is a software, that aims at enforcing portability of code and services across all platforms and differing kernels.

It does so by creating small independent boxes called containers that runs using the host machine's hardware but their own specific kernel/system.
Docker and Docker containers exists on the application layer of the host machine as a process with its own processID. Hence the containers supports "layerization" on top of themselves.

A docker running a specific application or service is called a docker container, and it is based off whats called an image. You can visualize images as cooking recipe that contains all sort of data/configuration for the docker container(it's recipe of something (e.g,NGINX image is the recipe for a web server)).

- The aim of the project is to go over:

[How to setup a functional system of containers including:]  

- An HTTP Web-Server in the form of **NGINX**.
- A basic Website in the form of **Wordpress**.
- A basic database implementation in the form of **MariaDB**.

This project emphasizes understanding of:
- Virtualization not of system as a whole but of application/services as processes using the Docker software technology
- The basics of system-architecture development (Dev-Ops).

### **Project Summary** :
The program instantiates Docker Images of subject-bound named services.  
It creates a network on the host machine(VM here), accessible via HTTPS protocol and allows the navigation on a NGINX hosted wordpress web-server.  
Everything is minimally configured but the point was to design the system-architecture not the website in itself.  
Wordpress is able to communicate with its own database and everything is stored in persistent volumes making it possible for data to stay persistent/present across multiple starts/restarts.

### **Project Description** :
[Virtual Machines vs Docker] :
> Virtual machines hosts themselves by using part of the physical hardware of the host machine an assigning it to themselves.  
>They also possess their own operating system and kernel (as a whole).  
> Whereas Docker only emulate the application layer of the kernel, it uses the hardware of the host (do not own its own virtual hardware).  
> Docker is faster, safer, more portable and easily configurable through DockerHub.  

[Secrets vs Environment Variables] :
> Secrets are specially identified Docker composed files that holds private API credentials. 
>This is meant to increase security as thoses passwords and sensitive data are not meant to be accessible through github (thanks to gitignore).  
> Environment variables are accessibles for all Dockers that are allowed to access them. They are used for configuration purposes (and infrastructure maintenance) and are critical to the user.  

[Docker Network vs Host Network] :
> By default Docker Containers can only see their own local network and they are isolated from the host unless they expose a port to it. Their default network configuration method between to container is bridged connection (isolated network connection segment).  
> It is possible to create local network for Dockers Containers to regroup them or isolate them from one another (like sub-netting) through the network command/attribute in the docker-compose file.  
> Docker Containers cannot access and cannot be accessed Host's network by any means other than ports.  
> Host network represent the host's actual network in the company's facilities or wherever he currently stays at.  
>It designate the interconnections between the different machines linked over the network .
  

Docker Volumes vs Bind Mounts:
> Docker Volumes and Bind Mounts are designed to deal with data persistency.  
> When shutting down the Dockers Containers, all of their writeable memory gets erased and the data is being lost. By creating Volumes or Binds Mounts we can solve this issue.  
> The main difference between volumes and bind mounts lies in how Docker Compose adjust itself to create this data persistency : Over volumes, it create a global virtual "Volume" that represent an external peripheral accessible for the Container.  
>In this regard, the Volume is named and known to both the host and the Container and is stored locally on the host machine under docker compose 's specified storage folder (the path you specify your volume to exist at). 
> Bind Mounts on the other hand is a hardcoded path in which a said service/container can store its data. The specified folder is mounted from the host to the docker container.  
> It is stored on the local host machine just like the volumes. It doesn't exist officially for the Docker-Compose (its not global). It is tied to a specific container and bypasses the logic of setting up global volumes environnment.  
  

### **Project Features** :

- Connection to NGINX Web-Server through port 443 only and using TLS encryption protocol.
- Navigation on Wordpress and communication to NGINX using FastCGI process manager technology (PHP-FPM).
- Database availability.
- Persistent data storage.
  

# Instructions

### **Installation** :
> ```  
> git clone <repo_url>  
> cd TheGoodCorner  
> make  
> ```

### **Usage** :
> ```  
> Access the website by typing https://mchanlia.42.fr or https://localhost on your local machine's web-browser.
>```
# Resources

#### Docs
[Documentation : Compose GettingStarted](https://docs.docker.com/compose/gettingstarted/)  
[Documentation : NGINX ConfigurationFile](https://nginx.org/en/docs/beginners_guide.html#conf_structure)  
[Documentation : NGINX Dockerization](https://medium.com/@srikanthjosyula/dockerizing-nginx-a-step-by-step-guide-for-beginners-a9bdc1944a44)  
[Documentation : NGINX HTTPS configuration](https://nginx.org/en/docs/http/configuring_https_servers.html)  
[Documentation : Debian](https://www.debian.org/releases/)  
[Documentation : NGINX ConfigurationFile](https://nginx.org/en/linux_packages.html#Debian)  
[Documentation : APT](https://manpages.debian.org/stretch/apt/apt.8.en.html)  
[Documentation : FASTCGI](https://fr.wikipedia.org/wiki/FastCGI)  
[Documentaiton : NGINX RequestProcess](https://nginx.org/en/docs/http/request_processing.html)  
[Documentation : FASTCGI Configuration](https://nginx.org/en/docs/http/ngx_http_fastcgi_module.html#fastcgi_param)  
[Documentation : Wordpress Installation](https://www.rosehosting.com/blog/how-to-install-wordpress-on-debian-12/)  
[Documentation : Wordpress Installation](https://make.wordpress.org/cli/handbook/guides/installing/)  
[Documentation : Wordpress InstallationVerification](https://make.wordpress.org/cli/handbook/guides/verifying-downloads/)  
[Documentation : SED](https://www.ionos.fr/digitalguide/serveur/configuration/commande-sed-de-linux/)  
[Documentation : MariaDB Installation](https://mariadb.com/docs/server/clients-and-utilities/deployment-tools/mariadb-install-db)  
[Documentation : Docker/Networkng](https://docs.docker.com/engine/network/)  
[Documentation : Docker/Storage](https://docs.docker.com/engine/storage/)  
[Documentation : Docker/Volume](https://docs.docker.com/engine/volumes/)  
[Documentation : Compose Environment](https://docs.docker.com/compose/how-tos/environment-variables/set-environment-variables/)  
[Documentation : Docker/Volume](https://docs.docker.com/reference/compose-file/volumes/)  
[Documentation : Test Command](https://www.it-connect.fr/verifier-la-presence-dun-repertoire-ou-dun-fichier/)  
[Documentation : Network Bridge](https://en.wikipedia.org/wiki/Network_bridge)  
[Documentation : Mysql Socket](https://www.digitalocean.com/community/tutorials/how-to-troubleshoot-socket-errors-in-mysql)  
[Documentation : Curl Command](https://www.geeksforgeeks.org/linux-unix/curl-command-in-linux-with-examples/)  
[Documentation : Shell Basics](https://pressbooks.senecapolytechnic.ca/uli101/chapter/shell-scripting-basics/)  
[Documentation : Set Command](https://www.geeksforgeeks.org/linux-unix/shell-scripting-set-command/)

#### Videos
[Video : Docker Essentials](https://www.youtube.com/watch?v=pg19Z8LL06w)  
[Video : NGINX linuxServer](https://www.youtube.com/watch?v=MP3Wm9dtHSQ)  
[Video : NGINX linuxServer](https://www.youtube.com/watch?v=n7vKxkMIBM0)  
[Video : PHP-FPM Wordpress](https://www.youtube.com/watch?v=TswVrfNQZHc)  

#### Others
[linode](https://en.wikipedia.org/wiki/Linode)
