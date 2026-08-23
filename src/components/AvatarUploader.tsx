"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Avatar from "./Avatar";
import {
  resetAvatarToGoogle,
  uploadAvatar,
  type AvatarState,
} from "@/lib/settings-actions";
import styles from "./AvatarUploader.module.css";

const initialUploadState: AvatarState = {};
const initialResetState: AvatarState = {};

interface AvatarUploaderProps {
  firstName: string;
  avatarUrl: string | null;
  googleAvatarUrl: string | null;
}

export default function AvatarUploader({
  firstName,
  avatarUrl,
  googleAvatarUrl,
}: AvatarUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [savedAvatar, setSavedAvatar] = useState<string | null>(avatarUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadState, uploadAction, uploadPending] = useActionState(
    uploadAvatar,
    initialUploadState,
  );
  const [resetState, resetAction, resetPending] = useActionState(
    resetAvatarToGoogle,
    initialResetState,
  );

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const wasUploadPending = useRef(false);
  useEffect(() => {
    if (wasUploadPending.current && !uploadPending && !uploadState.error) {
      setSavedAvatar(uploadState.avatarUrl ?? null);
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
    wasUploadPending.current = uploadPending;
  }, [uploadPending, uploadState]);

  const wasResetPending = useRef(false);
  useEffect(() => {
    if (wasResetPending.current && !resetPending && !resetState.error) {
      setSavedAvatar(resetState.avatarUrl ?? null);
      setPreview(null);
    }
    wasResetPending.current = resetPending;
  }, [resetPending, resetState]);

  const currentAvatar = preview ?? savedAvatar;

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (preview) URL.revokeObjectURL(preview);
    setPreview(file ? URL.createObjectURL(file) : null);
  }

  const showGoogleReset = Boolean(googleAvatarUrl);

  return (
    <div className={styles.wrap}>
      <Avatar avatarUrl={currentAvatar} name={firstName} size={72} />
      <div className={styles.controls}>
        <form action={uploadAction} className={styles.uploadForm}>
          <label className={styles.uploadLabel}>
            {uploadPending ? "Uploading…" : "Upload photo"}
            <input
              ref={fileInputRef}
              type="file"
              name="avatar"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={handleFileChange}
              disabled={uploadPending}
              className={styles.fileInput}
            />
          </label>
        </form>
        {showGoogleReset && (
          <form action={resetAction}>
            <button
              type="submit"
              className={styles.linkButton}
              disabled={resetPending}
              onClick={() => setPreview(null)}
            >
              {resetPending ? "Resetting…" : "Use Google photo"}
            </button>
          </form>
        )}
        <p className={styles.hint}>PNG, JPEG, WebP, or GIF. Max 2MB.</p>
        {uploadState.error && (
          <p className={styles.error} role="alert">
            {uploadState.error}
          </p>
        )}
        {resetState.error && (
          <p className={styles.error} role="alert">
            {resetState.error}
          </p>
        )}
      </div>
    </div>
  );
}
