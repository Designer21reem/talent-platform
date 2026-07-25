// Backend connection settings — override via .env.local for a different
// environment. NEXT_PUBLIC_* vars are inlined at build time, so the app
// must be restarted after changing them.
export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.hr-heaven.com';

// Asks the backend for a presigned S3 upload URL. `frontendSelection` must be
// one of the values the backend accepts (cv_upload_file, cv_builder_json,
// assessment_json, other_refrences_json) — it decides which S3 folder (data
// lake) the object lands in.
export async function requestUploadUrl(token, { fileName, fileType, fileSize, frontendSelection }) {
  const res = await fetch(`${BACKEND_URL}/generate-upload-url`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      file_name: fileName,
      file_type: fileType,
      file_size: fileSize,
      frontend_selection: frontendSelection,
    }),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.detail || 'The server refused to generate an upload URL.');
  }
  return data;
}

// PUTs the file/JSON body straight to S3 using the presigned URL. The
// x-amz-meta-* headers are required because the backend's presigned URL was
// generated with matching Metadata — S3 rejects the PUT without them.
export async function uploadToS3(uploadUrl, body, contentType, urlData) {
  const res = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': contentType,
      'x-amz-meta-user-id': String(urlData.user_id),
      'x-amz-meta-user-email': String(urlData.user_email),
      'x-amz-meta-frontend-selection': String(urlData.frontend_selection),
      'x-amz-meta-original-file-name': String(urlData.original_file_name),
    },
    body,
  });

  if (!res.ok) {
    throw new Error(`Upload to storage failed with status ${res.status}.`);
  }
}
