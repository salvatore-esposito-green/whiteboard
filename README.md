<div align="center">
	<br>
	<br>
	<picture>
		<source srcset="https://github.com/salvatore-esposito-green/whiteboard/blob/main/assets/image.jpg?raw=true">
        <img src="https://github.com/salvatore-esposito-green/whiteboard/blob/main/assets/image.jpg?raw=true" alt="Readme image" />
	</picture>
	<br>
	<br>
</div>

## Introduction

@whiteboard is an example of a client / server application for didactic purposes for the students of the Fonseca high school.

## Architecture overview

@whiteboard architecture is made of two components:

- A Frontend (`@whiteboard/frontend`), application in React with the aim of rendering a canvas with drawings made by users;
- A Server (`@whiteboard/server`), app in Nodejs / Express that uses `websockets` to receive and send data about users and their designs to the client.

## Installation

Once all dependencies are installed, proceed to launch the apps:

```sh
$ yarn install 
```

### ./packages/server

```sh
$ yarn run dev
```

### ./packages/frontend

```sh
$ PORT=9999 yarn run start:dev
$ yarn run ngrok
```

## Usage example

Connecting to the site `https://ideasolutions.eu.ngrok.io/` the user can start drawing with his finger or his mouse.

The canvas will take care of rendering the points and lines and will send them to the server via the `drawing` event.

```ts
useLayoutEffect(() => {
	const { userId } = user;
	const roughCanvas = rough.canvas(canvasRef.current);

	if (elements.length > 0) {
		ctx.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
	}

	elements.forEach((ele, i) => {
		roughCanvas.curve(ele.path, {
			stroke: ele.stroke,
			roughness: 0.5,
			strokeWidth: 5,
			bowing: 0.01,
		});
	});

    const canvasImage = canvasRef.current.toDataURL();

    /**
     * @name drawing
     * @description Emits the drawing to the server with the user id
     */
    if (elements.length > 0) {
        socket.emit("drawing", canvasImage, user);
    }
}, [elements]);
```

The server will take the received information and output it to all listening clients via `websocket`.

```javascript
/**
 *
 * @param data immagine in base64
 * @param userId id dell'utente che ha inviato l'immagine
 */
socket.on("drawing", (data, userId) => {
	imageUrl = data;

	socket.broadcast.emit("canvasImage", imageUrl, userId);

    socket.broadcast.emit("message", {
        message: `✏️ **${username}** Sta disegnando...`,
    });
    
    
});
```

Finally, the presentation client will take care of rendering all the drawings:

```ts
useEffect(() => {
	/**
	 * @description When the server sends a canvas image, update the imageArr[]
	 */
	socket.on("canvasImage", (data, userId) => {
		if (data && userId) {
			// set imageArr to include the new image with userId as key
			setImageArr((imageArr) => ({ ...imageArr, [userId]: data }));
		}
	});
}, []);

const imagesHtml = useCallback(() => {
	return Object.keys(imageArr).map((userId, index) => {
		if (!imageArr[userId]) return;

		return (
			<div key={userId.toString()} className={styles.client__image}>
				<img src={imageArr[userId]} alt={userId} />
			</div>
		);
	});
}, [imageArr]);
```

## Other

To start the presentation client use the url parameter: `?isPresenter=true`

> https://ideasolutions.eu.ngrok.io/?isPresenter=true

```ts
const queryParams = new URLSearchParams(window.location.search);
const isPresenter = !queryParams.get("isPresenter");

const handleSubmitForm = useCallback(() => {
	if (username.trim() === "") return;

	const user = {
		roomId: "roomId",
		userId: uuid(),
		username: username,
		host: true,
		presenter: isPresenter || false,
	};

	sessionStorage.setItem("user", JSON.stringify(user));
}, [username, isPresenter]);
```

As you can see in the user interface there is also a `roomId`, this is to ensure that in the future it will be possible to selectively communicate between client and server via a specific id.

To do this, the server part should be reviewed like this:

```javascript
// brodcast for all clients
socket.broadcast.emit("canvasImage", imageUrl, userId);
// brodcast to single room id
socket.broadcast.to(user.roomId).emit("canvasImage", imageUrl, userId);
```

# Todos

- [ ] Fix typescript scss module