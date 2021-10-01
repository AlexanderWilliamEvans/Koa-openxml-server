// https://www.digitalocean.com/community/tutorials/how-to-build-a-hello-world-application-with-koa
'use strict';
const Koa = require('koa');
const fs = require('fs');
const http = require('http');
const path = require('path');
const mount = require("koa-mount");
const cors = require('koa-cors');
const { Document, ImageRun, Packer, Paragraph, TextRun } = require('docx');
const Router = require('@koa/router');
//const { PassThrough } = require('stream');

const app = new Koa();
const router = new Router();
const host = process.env.PORT || 3008;

app.use( async(ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.log(err.status)
    ctx.status = err.status || 500;
    ctx.body = err.message;
  }
});

router.get('home', '/', (ctx) => {
  ctx.body = 'Hello World';
});

const imageUrlToBase64 = async(url) => {
  const fetch = (url) => import('node-fetch').then(({default: fetch}) => fetch(url));
  const data = await fetch(url);
   return new Promise((resolve) => {
     const reader = new window.FileReader();
     reader.readAsDataURL(blob); 
     reader.onloadend = () => {
       const base64data = reader.result;   
       resolve(base64data);
     }
   });
};

router.get('download', '/download', async(ctx) => {
  try {
   // const base64Img = await imageUrlToBase64("https://images.unsplash.com/photo-1632845510162-c1c7c8d53780?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=687&q=80");
    const doc = new Document({
      sections: [
          {
              children: [
                  new Paragraph({
                      children: [
                          new TextRun("Hello World"),
                          new ImageRun({
                              data: fs.readFileSync("./demo/images/dog.jpg"),
                              transformation: {
                                  width: 100,
                                  height: 100,
                              },
                          }),
                      ],
                  }),
                  new Paragraph({
                      children: [
                          new ImageRun({
                              data: fs.readFileSync("./demo/images/dog.jpg"),
                              transformation: {
                                  width: 100,
                                  height: 100,
                              },
                          }),
                      ],
                  }),
                  new Paragraph({
                      children: [
                          new ImageRun({
                              data: fs.readFileSync("./demo/images/dog.jpg"),
                              transformation: {
                                  width: 100,
                                  height: 100,
                              },
                          }),
                      ],
                  }),
                  new Paragraph({
                      children: [
                          new ImageRun({
                              data: fs.readFileSync("./demo/images/dog.jpg"),
                              transformation: {
                                  width: 100,
                                  height: 100,
                              },
                          }),
                      ],
                  }),
                  new Paragraph({
                      children: [
                          new ImageRun({
                              data: fs.readFileSync("./demo/images/parrot.jpg"),
                              transformation: {
                                  width: 100,
                                  height: 100,
                              },
                          }),
                      ],
                  }),
                 /*  new Paragraph({
                       children: [
                           new ImageRun({
                               data: Buffer.from(base64Img, "base64"),
                               transformation: {
                                   width: 100,
                                   height: 100,
                               },
                           }),
                       ],
                   }), */
              ],
          },
      ],
  });
  
  Packer.toBuffer(doc).then((buffer) => {     
    const url = path.join(process.env.HOME || process.env.USERPROFILE, 'downloads/');
    const file_url = ctx.request.body;
  //   const fileName = url.parse(file_url).pathname.split('/').pop();
  //   const filePath = path.join(DOWNLOAD_DIR,fileName);
     fs.writeFileSync(`${url}test.docx`, buffer);
  });
  } catch (err) {
    console.error(err);
  }

});

app.use(router.routes()).use(router.allowedMethods());

app.listen(`${host}`, async() => {
  console.info(`Server is running on port ${host}`);
});