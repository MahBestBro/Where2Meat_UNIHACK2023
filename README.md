# Where2Meat_UNIHACK2023
Where 2 Meat is a convenient site that not only locates the best central meeting point for you and all your friends, but also offers a range of restaurants and café options in the vicinity of the central point. Simply enter your location and your friends’, and lo and behold, the common point is shown on the map with all the recommended wonderful restaurants and cafes that you can visit to catch up with your old buds. The estimated precise range, address, ratings, and opening hours are also presented so that the user can make a decision that everyone is happy with. Moreover, a health rating for each one of the options is presented for those who want to watch what they eat

## Table of Contents :bulb:

- [Images](#images) :file_folder:
- [Setup Requirements](#setup) :rocket:
- [Libraries and APIs used](#libraries) :computer:
- [Future Plans](#plans) :bulb:

<a name="images"></a>

## Images :file_folder:

Initial Page
![image](https://user-images.githubusercontent.com/64310471/222941549-a5c91b25-09c6-48a3-8a21-8501a06adac0.png)

Autocomplete Suggestions for search places
![image](https://user-images.githubusercontent.com/64310471/222941585-f6fddf99-46db-4b70-a7d6-8ecc21e915fe.png)

The blue marker is the center point (you can hover over all the markers to see which location they are for)
![image](https://user-images.githubusercontent.com/64310471/222941674-2d7cdc3e-2077-4279-b666-e038869c812c.png)


<a name="setup"></a>

## Setup Requirements :rocket:

The project consists of 2 main components, the client side or frontend and the server side or backend. These compoents can be found in the `client/` and `server/` folders respectively.

To run the project you will need to install a few components

1. [NodeJS](https://nodejs.org/en/)
2. Yarn - can be installed using npm (comes by default with node)
   1. `npm install -g yarn`

Next, you will need to create a `.env` file inside `server/`

```bash
API_KEY=yourApiKey
```

To install the dependencies for the projects, use the command

```bash
yarn install
```

To run the project, simply use the command

```bash
yarn start
```

<a name="libraries"></a>

## Libraries and APIs Used :computer:

1. Google Maps API
2. Google Places API
3. All other NodeJS based libraries can be found in the `package.json` file

<a name="plans"></a>
## Future Plans :bulb:

1. Be able to drag the center location marker to find a better or more ideal spot
2. Allow other users to enter their own location using a link instead of one user controlling it all
