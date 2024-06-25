import {FC} from "react";

``
import {useRef} from 'react';
import {ActionIcon, rem} from '@mantine/core';
import {TimeInput} from '@mantine/dates';
import {IconClock} from '@tabler/icons-react';
import {Button, Group, TextInput} from '@mantine/core';
import {useForm} from '@mantine/form';
import parse from 'html-react-parser';
import {useNavigate} from "react-router-dom";

interface Values {
    time: string;
    code: string;
}

const Home: FC = () => {
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
            code: '',
            // termsOfService: false,
        },

        validate: {
            time: (value) => (value.length !== 0 ? null : '時間を入力してください'),
            code: (value) => (value.length !== 0 ? null : '埋め込みコードを入力してください'),
        },
    });

    const submitHandler = (values: Values) => {
       navigate('/calibration', {state: {time: values.time , code: values.code}})
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
                        <TextInput
                            withAsterisk
                            label="埋め込みコード"
                            placeholder="埋め込みコードを入力"
                            key={form.key('code')}
                            {...form.getInputProps('code')}
                        />
                        <Group justify="flex-end" mt="md">
                            <Button type="submit">Submit</Button>
                        </Group>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Home