# image-to-s3

Uploads images(jpg) to S3 bucket and generates link to it. Also has an image resize feature.

## How to use
 - Enter the following link in your browser for the basic uploader   
`https://s3upload-frontend.s3.us-east-2.amazonaws.com/index.html`
 - Enter the following link in your borwser for the image resizer   
`https://s3upload-frontend.s3.us-east-2.amazonaws.com/change.html`

## Basic Uploader
![image-uploader](https://user-images.githubusercontent.com/47936078/123515581-97d9f380-d6b5-11eb-934b-f6908df4c849.png)

### Design
![initial-image-to-s3-2x](https://user-images.githubusercontent.com/47936078/123515597-ab855a00-d6b5-11eb-9e0f-92890b05ddfc.png)

Step - 1:
    The Vue app sends a get request to the API endpoint.

Step-2: 
    The API endpoint invokes a lambda function that gets a signed URL from AWS S3 at which the vue application can upload the image. The file name at which the new image will be uploaded is also generated here.

Step - 3:
    The Vue application receives the URL at which it can upload the image.

Step - 4:
    The Vue application uploads the image to S3 bucket through the link received.

## Image Resizer
![image-resizer](https://user-images.githubusercontent.com/47936078/123515655-e2f40680-d6b5-11eb-8ce6-c55b0d558138.png)

### Design
![final-image-to-s3](https://user-images.githubusercontent.com/47936078/123515666-ec7d6e80-d6b5-11eb-8475-60be26617eaf.png)

Step - 1:
    The Vue application sends a GET request to the API endpoint along with width and height as parameters (may just be width or only height).

Step - 2:
 - The API endpoint invokes a lambda function which will get a signed URL. 
 - It ensures that the file name at which the image is uploaded, contains the width and height in it. 
 - This function is also responsible for generating the link at which the resized image will be. 
 - The generation is based on the bucket name and region which are available as environment variables to the function. 
 - The file name at which the new image will be uploaded is also generated here.

Step - 3:
    The Vue application receives the signed URL at which the original image will be uploaded.

Step - 4:
    The Vue application uploads the image to a S3 bucket through the URL received.

Step - 5:
    A lambda function observes the S3 bucket at which the Vue application uploads. It will get invoked when a new object is put into that S3 bucket. 

Step - 6:
    The lambda function receives the records of the new object in the bucket it is continuously observing.

Step - 7:
    The lambda function resizes the image based on the dimension mentioned in the file name of the image in the S3 bucket.

Step - 8:
    The lambda function uploads the resized image to a different S3 bucket.

