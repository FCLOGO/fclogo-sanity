import React, { useState, useCallback } from 'react';
import { set, StringInputProps } from 'sanity';
import { Box, Card, Flex, Text, Button, Spinner, TextInput } from '@sanity/ui';
import { UploadIcon } from '@sanity/icons';

// 配置 Worker 信息
const PRESIGNER_WORKER_URL = 'https://r2-upload-presigner.fclogo.workers.dev';
const AUTH_KEY = 'FCLOGO_R2_UPLOAD_PRESIGNER'; // 必须与你在 Worker 中设置的 AUTH_KEY 相同

export function R2Uploader(props: StringInputProps) {
  const { value, onChange } = props;
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      // 1. 请求预签名 URL
      const presignResponse = await fetch(PRESIGNER_WORKER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Key': AUTH_KEY,
        },
        body: JSON.stringify({ filename: file.name, contentType: file.type }),
      });

      if (!presignResponse.ok) {
        throw new Error(`Failed to get presigned URL: ${await presignResponse.text()}`);
      }

      const { uploadUrl, relativePath } = await presignResponse.json();

      if (!uploadUrl || !relativePath) {
        throw new Error('Worker response is missing uploadUrl or relativePath.');
      }

      // 2. 上传文件到 R2
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });

      if (!uploadResponse.ok) {
        throw new Error(`Failed to upload to R2: ${await uploadResponse.text()}`);
      }
      
      // 3. 将最终的相对路径写入 Sanity
      onChange(set(relativePath));

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  }, [onChange]);

  return (
    <Card padding={3} radius={2} shadow={1}>
      <Flex align="center" gap={3}>
        <Box flex={1}>
          <TextInput
            value={value || ''}
            readOnly
            placeholder="上传文件以生成 R2 链接"
          />
        </Box>
        <Button
          as="label"
          icon={isUploading ? undefined : UploadIcon}
          text={isUploading ? undefined : '上传'}
          mode="ghost"
          disabled={isUploading}
          style={{ position: 'relative', cursor: 'pointer' }}
          type="submit"
        >
          {isUploading && <Spinner />}
        </Button>
        <input
          type="file"
          accept="image/png, image/svg+xml"
          onChange={handleFileChange}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0,
            cursor: 'pointer',
          }}
        />
      </Flex>
      {error && (
        <Box marginTop={3}>
          <Card tone="critical" padding={3} radius={2}>
            <Text>{error}</Text>
          </Card>
        </Box>
      )}
    </Card>
  );
}