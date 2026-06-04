export const getCSP = (envVariables) => {
  const {
    REACT_APP_HOST,
    REACT_APP_TELEMETRY_HOST,
    REACT_APP_LEARNER_AI_BASE_URL,
    REACT_APP_LEARNER_AI_ORCHESTRATION_HOST,
    REACT_APP_AWS_S3_BUCKET_CONTENT_URL,
    REACT_APP_AWS_S3_BUCKET_URL,
    REACT_APP_CSP_APP_HOST,
    REACT_APP_PRESIGNED_URL_SERVICE,
    REACT_APP_AXL_HOST,
  } = envVariables;

  // Use empty string fallback for every env var so undefined never appears in the CSP string
  // (an undefined value in a template literal produces the literal text "undefined"
  //  which the browser parser can misread as a directive name)
  const s3Url = REACT_APP_AWS_S3_BUCKET_URL || "";
  const s3Content = REACT_APP_AWS_S3_BUCKET_CONTENT_URL || "";
  const telemetry = REACT_APP_TELEMETRY_HOST || "";
  const host = REACT_APP_HOST || "";
  const aiBase = REACT_APP_LEARNER_AI_BASE_URL || "";
  const orchestHost = REACT_APP_LEARNER_AI_ORCHESTRATION_HOST || "";
  const cspAppHost = REACT_APP_CSP_APP_HOST || "";
  const presignedUrlService = REACT_APP_PRESIGNED_URL_SERVICE || "";
  // AXL parent portal — allows the iframe-mode child app to talk to AXL APIs.
  const axlHost = REACT_APP_AXL_HOST || "";
  // Each directive must be on a single logical line — newlines inside the template
  // can cause the browser CSP parser to split a directive mid-value.
  return [
    "default-src 'none'",
    "manifest-src 'self'",
    "script-src 'self' blob: https://cdn.jsdelivr.net 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.cdnfonts.com/",
    "font-src 'self' https://fonts.gstatic.com https://fonts.cdnfonts.com",
    `img-src 'self' data: https://raw.githubusercontent.com https://cdn.jsdelivr.net https://github.com https://images.squarespace-cdn.com ${s3Content} ${s3Url}`.trim(),
    `media-src 'self' blob: https://*.amazonaws.com ${s3Url} ${s3Content} ${presignedUrlService} https://raw.githubusercontent.com https://github.com`.trim(),
    `connect-src 'self' https://*.amazonaws.com https://*.theall.ai ${axlHost} https://telemetry.theall.ai https://telemetry-dev.theall.ai ${telemetry} ${host} ${aiBase} ${orchestHost} ${s3Url} ${s3Content} ${presignedUrlService} blob: https://huggingface.co https://cas-bridge.xethub.hf.co https://cdn.jsdelivr.net`.trim(),
    "form-action 'self'",
    "frame-src 'self' https://www.google.com https://www.gstatic.com https://www.youtube.com https://www.youtube-nocookie.com",
    "object-src 'none'",
    "base-uri 'none'",
    "worker-src 'self' blob:",
  ]
    .join("; ")
    .replace(/\s+/g, " "); // collapse any accidental double-spaces from empty vars
};
