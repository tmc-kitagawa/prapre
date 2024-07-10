import { Group, Text, rem } from '@mantine/core';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons-react';
import { Dropzone,  PDF_MIME_TYPE } from '@mantine/dropzone';
import {Dispatch, FC, SetStateAction} from "react";

interface Props {
    setSlide:  Dispatch<SetStateAction<File | null |  string>>
}

export const PdfDropzone : FC<Props> = (props) => {
    const {setSlide} = props

    return (
        <>
        <Dropzone
            onDrop={(files) => {
                setSlide(files[0])
                console.log(files[0])
            }}
            onReject={(files) => console.log('rejected files', files)}
            // maxSize={5 * 1024 ** 2}
            accept={PDF_MIME_TYPE}
            {...props}
        >
            <Group justify="center" gap="xl" mih={150} style={{ pointerEvents: 'none' }}>
                <Dropzone.Accept>
                    <IconUpload
                        style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }}
                        stroke={1.5}
                    />
                </Dropzone.Accept>
                <Dropzone.Reject>
                    <IconX
                        style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }}
                        stroke={1.5}
                    />
                </Dropzone.Reject>
                <Dropzone.Idle>
                    <IconPhoto
                        style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }}
                        stroke={1.5}
                    />
                </Dropzone.Idle>

                <div>
                    <Text size="xl" inline>
                        PDFファイルをドラッグ&ドロップ
                    </Text>
                    {/*<Text size="sm" c="dimmed" inline mt={7}>*/}
                    {/*    Attach as many files as you like, each file should not exceed 5mb*/}
                    {/*</Text>*/}
                </div>
            </Group>
        </Dropzone>
        </>
    );
}