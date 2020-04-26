How to deploy our application
DynamoDB:
1. สร้าง Database ตั้งชื่ออะไรก็ได้ โดยกำหนดให้มี Key เป็น userName หรือ email

IAM Role part:
1. สร้าง Role ที่มี Policy full access สำหรับ DBname ที่ตั้งชื่อไว้ในหัวข้อก่อนหน้า
2. สร้าง Role สำหรับ CodePipeline มี Policy full access สำหรับ access ECR

Lambda part:
1. สร้าง Lambda function ขึ้นมาโดยตั้งชื่อตามชื่อ folder ใน Eldist-check-list/lambda_source_code หรือตั้งตามที่เหมาะสม
2. เลือก Runtime เป็น Python 3.8 
3. เลือก execution role ให้สัมพันธ์กับข้อ 2 โดยที่ตัว main function (ที่เชื่อมต่อกับ DB) ให้ใช้ role ที่มี DBname full access และ function ที่จัดการ authentication ให้ใช้ role ที่มี cognito policy จากนั้นกด create function
4. ทำการคัดลอก source code จาก folder Eldist-check-list/lambda_source_code มาแปะไว้ใน lambda_function จากนั้นกด save 
5. ไปที่ส่วน designer ด้านบน กด add trigger และเลือก API gateway จากนั้นสร้าง HTTP API ขึ้นมา พร้อมเลือก security เป็น open และ enable CORS
6. ไปที่ console ของ API Gateway และเลือก API ที่สร้างเอาไว้ ไปที่ CORS config ให้เป็น * ทั้งหมด

AWS Cognito
1. ไปที่ Amazon Cognito console แล้วเลือก Manage your User Pools
2. สร้าง User Pool
2.1. ตั้งชื่อและกำหนด Attribute ต่างๆที่ต้องการ
2.2. กด Add an app client และตั้งค่าให้เรียบร้อย
2.3. Review และกด Create pool
2.4. กดบันทึก Pool ID
3. สร้าง App Client
3.1. เลือก App clients แล้วกด Add an app client
3.2. ตั้งชื่อและตั้งค่า กด Enable username password auth for admin APIs for authentication (ALLOW_ADMIN_USER_PASSWORD_AUTH)
3.3.  สร้าง app client แล้วจดบันทึก App client ID และ APP Client Secret
4. สร้าง Lambda function
 4.1. Signup, Confirm Signup, Login, test_user
 4.2. เพิ่ม AmazonCognitoPowerUser ใน Permissions policies ของ Login และ test_user
5. สร้าง API Gateway
 5.1. สร้าง REST API สำหรับ Lambda function 
 5.2. กด Enable CORS ใน POST API ที่สร้าง
 5.3. กด Deploy API
 5.4. เลือก stage แล้วจดบันทึก Invoke URL

Pipeline for ECS Deployment:
1. สร้าง Repository บน ECR
2. สร้าง task definition บน ECS
 2.1. เลือกแบบ Fargate
 2.2. ทำการ config ตัว task
  2.2.1. Task memory = 1 GB
  2.2.2. Task CPU = 0.5
 2.3.ทำการ container definition โดย ใส่ container name และ repository url สำหรับ image
3.สร้าง ECS Cluster
 3.1. เลือก Cluster Template แบบ Networking only
 3.2. ใส่ค่าต่างๆให้เรียบร้อย
4. ทำการสร้าง Service ใน ECS Cluster ที่พึ่งสร้างขึ้นมา
 4.1. Config ตัว task-def ให้เป็นตัวที่เราพึ่งสร้างขึ้นมา
 4.2. เลือก Launch type เป็น Fargate
 4.3. Number of task = 2
 4.4. Deployment Type = Blue/Green และใช้ Default setting
 4.5. Config VPC และ  Subnet
 4.6. สำหรับ Load balancer ถ้ายังไม่มีให้ Create ตัว load balancer เลือกเป็น Application Load Balancer ก่อน และทำการ config ให้เรียบร้อย
 4.7. สำหรับ Auto Scaling เลือก Do not adjust the service’s desired count
5. ทำการแก้ไขไฟล์ taskdef.json ที่อยู่ใน Github ให้เป็นตามอันที่พึ่งสร้างใหม่ โดยเอา data ที่ได้จาก ECS -> Task Definition -> เลือกอันล่าสุด -> json
6. ทำการแก้ไขไฟล์ appspec.yaml ตรง Task Defnition นำ ARN ของ Task Definition มาใส่
7. ไปที่ Code Pipeline และทำการ config ดังนี้
 7.1. เลือก Create new pipeline และใส่ชื่อ Pipeline ตามต้องการ
 7.2. เลือก New Service Role และกด Next
 7.3. ทำการเลือก Source provider ตามที้มีโค้ดวางไว้
 7.4. สำหรับ Build step เลือก Code build และทำการ Create project
  7.4.1. สำหรับ Environment เลือกเป็น Managed Image
  7.4.2. OS = Amazon Linux 2
  7.4.3. Runtime = Standard
  7.4.4. ทำการเลือก Privilaged
  7.4.5. เลือก insert build command และใส่ข้อมูลดังนี้
   commands:
       - $(aws ecr get-login --no-include-email --region ap-northeast-1)
       - docker build -t eldist .
       - docker tag eldist:latest <ecr_repository_url>:latest
       - docker push <ecr_repository_url>:latest
  7.5. สำหรับ Deploy Stage
   7.5.1. Deploy Provider เป็ร AWS ECS(Blue/Green)
   7.5.2. ทำการเลือก application name และ deployment group ที่ถูกสร้างไว้แล้ว
   7.5.3. Input artifact เลือก source artifact
   7.5.4. Amazon ECS task definition และ AWS CodeDeploy AppSpec file เลือก Source Artifact



This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
