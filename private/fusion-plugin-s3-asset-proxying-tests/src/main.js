import App, { assetUrl } from "fusion-core";
import AWS from "aws-sdk";

import AssetProxyingPlugin, {
  S3ConfigToken
} from "@uber/fusion-plugin-s3-asset-proxying";

const assetPath = assetUrl("./fusion-asset.json");

export default () => {
  const app = new App(assetPath, el => el);

  if (__NODE__) {
    app.register(AssetProxyingPlugin);
    app.register(S3ConfigToken, {
      bucket: "test-bucket",
      prefix: "",
      s3ForcePathStyle: true,
      accessKeyId: "ACCESS_KEY_ID",
      secretAccessKey: "SECRET_ACCESS_KEY",
      endpoint: new AWS.Endpoint(`http://localhost:${process.env.S3_PORT}`)
    });
  }

  return app;
};
