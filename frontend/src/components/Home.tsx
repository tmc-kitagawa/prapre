import React, {Dispatch, FC, SetStateAction} from "react";

``
import {useRef} from 'react';
import {ActionIcon, rem} from '@mantine/core';
import {TimeInput} from '@mantine/dates';
import {IconClock} from '@tabler/icons-react';
import {Button, Group} from '@mantine/core';
import {useForm} from '@mantine/form';
import {useNavigate} from "react-router-dom";
import {PdfDropzone} from "../components/PdfDropzone"
import {Document, Page} from "react-pdf";

interface Values {
    time: string;
    // code: string;
}

interface Props {
    slide: any;
    setSlide: Dispatch<SetStateAction<File | null | string>>;
    setPresentationTime: React.Dispatch<React.SetStateAction<string>>;
}

const Home: FC<Props> = ({slide, setSlide, setPresentationTime}) => {
    const ref = useRef<HTMLInputElement>(null);
    const navigate = useNavigate()
    const pickerControl = (
        <ActionIcon variant="subtle" color="gray" onClick={() => ref.current?.showPicker()}>
            <IconClock style={{width: rem(16), height: rem(16)}} stroke={1.5}/>
        </ActionIcon>
    );

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            time: '03:00',
            // code: '',
            // termsOfService: false,
        },
        validate: {
            time: (value) => (value.length !== 0 ? null : '時間を入力してください'),
            // code: (value) => (value.length !== 0 ? null : '埋め込みコードを入力してください'),
        },
    });

    const submitHandler = (values: Values) => {
        setPresentationTime(values.time)
        navigate('/calibration')
    }

    return (
        <>
            <div>
                <div>
                    <h1>PraPre</h1>
                    <p>Practice for Presentations</p>
                </div>

                <div>
                    <form onSubmit={form.onSubmit(submitHandler)}>
                        <TimeInput
                            withAsterisk
                            label="アイコンをクリックして時間を入力してください" ref={ref}
                            rightSection={pickerControl} key={form.key('time')}
                            {...form.getInputProps('time')}/>
                        {/*<TextInput*/}
                        {/*    withAsterisk*/}
                        {/*    label="埋め込みコード"*/}
                        {/*    placeholder="埋め込みコードを入力"*/}
                        {/*    key={form.key('code')}*/}
                        {/*    {...form.getInputProps('code')}*/}
                        {/*/>*/}
                        <PdfDropzone setSlide={setSlide}/>
                        <Group justify="flex-end" mt="md">
                            <Button type="submit">Submit</Button>
                        </Group>
                        {slide && <Document file={slide}>
                            <Page width={200} pageNumber={1}/>
                        </Document>}
                    </form>
                </div>
            </div>
        </>
    )
}

export default Home