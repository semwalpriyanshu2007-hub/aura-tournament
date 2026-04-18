import fs from 'fs';
const data = {
  "type": "service_account",
  "project_id": "turnament-85bba",
  "private_key_id": "7ebca69ef1e052a6d2ab49d0675925c105a3624b",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDUPDT/ncMGTL5U\nHNb3/pX1ItW4iWR4F9ZGP+bQ3A0/hZi8reptTdYIRpA3di1+gG9FVB2idmPNMgXK\nnUx8Aw6e8xaBytk52u0UM38zXyPzNpcKNzjay300WVDlrtcPxC2A2Hd4wQZQ34UY\nnOi2xZhcaEzZs2Iy7Rh1A8dpIiGxFIIUb9BRf/wCbXMBzKlkY8mOcdwvhyyTd6wr\nRrlC4y1cfEaq08gTnOomt26maxTB/tNIrAFBmd21kHama7fWP2xwcATaeArA98LS\n4uaptOQA1azPP0YkwrJiJZQVowma8o6KVjfHm0OdkhDge0ca++pSUMWaFFyYd8t2\nta91oXsxAgMBAAECggEAAK9sR5VnN2WXPIcWgpjfbxOWHd4DsjrErFfK4DD1sf2c\nCQmFHXLU40eNcg0ybgG7Wj2NSVfMg35LDbGeuTL67YFBBb/b6uRNqg6iG7TA7vYY\n9fJIf4K/4r1iSRUpbv//jZzyHDSAJFHnohuCyaRI4g0Y9Z/IpcilY/ghJ37x6oDY\ninbXJSwz5xa0SZq8AK2MAqmFDLbDw3RtB5xl6WrI1FVCxU4VuuI0z3exJLlNgI2w\nYGGYcMfnwH7mZimPvhR7QKLexVgG8txAtK2u+ov65EW1pVUBxNLEo9/qnZXuZPMO\nNLJnToNJiRnd3aQv8W3NoZ5W6aGjF5XHXLFx8Jv6KQKBgQD0/cUa8EtLA1vNp/GM\nEBxNF05j8jfjhLI0ZUp9ISEOgCNOsTlDf3Tj+ucgnQrZsdbi+etuJlCfFJBczQK6\ne/LEG70A5+J9FFbh02HDrDROy4fXM9svks8N4lLIaJbl1AvAt6sQKXNN3BParVC0\nDEWDXOTnSyssD+QniDTNxFSa9wKBgQDdxaGAnYSw4sAh1P13FW3aGF9XiIszA+VO\nHFVfMtJGpJYPfK6PBXk1/bdeeJ/WGGTBw+XPoG7UpYjwZcxPkiojWWPiTB0vM6TK\nlBWieDqbrY9DprMWxojb25S+PoiI0ja09UIjHyGcPhpR5TBmhCGFLZe/Xy734vx5\nvhoBkPopFwKBgQDuwJDiG+OEixVgapbfpKOwDVJ73IXS2HLC1SOupiaM9xtxiQ0B\nVqkXtGCiS+lTFhkQwfZKNlTDc0rs5W4PRtPjghTDWThEJRo2ocXY521ijL8pXoPw\n7OWT5kg+vo6wE+IQQe4Xpg2UhzFiHx1TGdJ0nocFUSAVpLb4P6kWDotVKQKBgDQ/\na10xvyEtSratx0lW8xp+w3eL47+RG2TbqAFVp9Sc0f20Eiv/zh66N4k6Qe3esV41\nGN9hnLrchPaeBRR6CxNo6+9Un0uPjzNqz+4HBUfIDAiULX0gKP4jLVfkw6X4YIsh\nfQNpQjHdL7Y7mLuORZdqtmWPtzEPeQv1jYrw7P7hAoGBAPNGAU7xAOamee1YBw9d\ TVJQtFwPYdR+9KdAl8rHLZrXcRLdYK3dXv4elbURa03mprbxETD2ChLo4n+N1K/F\n7LapCNqq56UXTIQlj4HL7NCmc0OqPAxZwIvFYkAsFHl1fXOgxAdkeUoCKQOTIDQs\n67YaY+8zxaLUIk7Qeqqnvpyc\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@turnament-85bba.iam.gserviceaccount.com",
  "client_id": "106327296175555218222",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40turnament-85bba.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};
fs.writeFileSync('serviceAccountKey.json', JSON.stringify(data, null, 2));
console.log('File written successfully');
