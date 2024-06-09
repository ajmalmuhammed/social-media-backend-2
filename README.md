
# Social Media Backend

This is a basic API for a social media website. Here users will be able to login using an otp sent to his mail and add posts(text) and like others posts.

## Prerequisites

- Create a .env file by following the .env.example file provided




If docker compose is already there on your system, just run

```
    docker-compose up --build
```
If you dont have docker then follow the below steps: 

- Install all the node modules required using package.json

```bash
    npm install 
```

    
## Deployment

To start the api run

```bash
  npm run start
```


## How to use

- To register
        
    ` api/register `  
    - Method : `POST`
    - request
    ```json
        {
          "emailId": _mailid_,
          "firstName": _firstName_,
          "lastName": _lastName_
        }
    ```

- To login
        
    ` api/login `  
    - Method : `POST`
    - request
    ```json
        {
          "emailId": _mailid_
        }
    ```

- To verify OTP
    ` api/verify `  
    - Method : `POST`
    - request
    ```json
        {
          "verification_key": _from the response of login request_
          "otp": _otp received on mail_
          "emailId": _same email used for request otp_
        }
    ```
    A cookie (jwt token) will be set after verification of the otp.
- To add profile details after verification
    ` api/update-profile `  
    - Method : `POST`
    - Cookie : _jwt_token_
    - request:
    ```json
        {
           "emailId" : _mailid_,
           "userId" : _userId_
           "firstName": _first name to be updated_
           "lastName": _lastname to be updated_
        }
    ```
- To add post after succesfull login
    ` api/post/create `  
    - Method : `POST`
    - Cookie : _jwt_token_
    - request:
    ```json
        {
            "title" : "this is the title",
            "content": "this is the content of this post"
        }
    ```

- To like a post after succesfull login
    ` api/post/like/:id `  
    - Method : `PUT`
    - Cookie : _jwt_token_
    - id - the postID present in DB

     
- To delete user's post
    ` api/post/delete/:id `  
    - Method : `DELETE`
    - Cookie : _jwt_token_
    - id - the postID present in DB

- To get all the user's post
    ` api/post/get-all `  
    - Method : `GET`
    - Cookie : _jwt_token_

- To logout
    ` api/logout `  
    - Method : `GET`
    - Cookie : _jwt_token_
    - request:

