import React, { Dispatch, FC, SetStateAction, useEffect } from "react";
import { useRef } from "react";
import { ActionIcon, rem } from "@mantine/core";
import { TimeInput } from "@mantine/dates";
import { IconClock } from "@tabler/icons-react";
import { Button, Group, Flex } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { PdfDropzone } from "../components/PdfDropzone";
import { Document, Page } from "react-pdf";
// import axios from "axios";
// import Signout from "./Signout";
import "./Home.scss";

// import {FaSignOutAlt, FaUser} from "react-icons/fa";
// import {useDisclosure} from "@mantine/hooks";

interface Values {
  time: string;
  // code: string;
}

interface Props {
  setUserId: React.Dispatch<React.SetStateAction<number | null>>;
  slide: any;
  setSlide: Dispatch<SetStateAction<File | null | string>>;
  setPresentationTime: React.Dispatch<React.SetStateAction<string>>;
}

const Home: FC<Props> = ({
  setUserId,
  slide,
  setSlide,
  setPresentationTime,
}) => {
  // const [opened, {open, close}] = useDisclosure(false);
  // const [opened, {toggle}] = useDisclosure();
  const ref = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const pickerControl = (
    <ActionIcon
      variant="subtle"
      color="gray"
      onClick={() => ref.current?.showPicker()}
    >
      <IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
    </ActionIcon>
  );

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      time: "03:00",
      // code: '',
      // termsOfService: false,
    },
    validate: {
      time: (value) => (value.length !== 0 ? null : "時間を入力してください"),
      // code: (value) => (value.length !== 0 ? null : '埋め込みコードを入力してください'),
    },
  });

  useEffect(() => {
    (async () => {
      try {
        // const res = await axios("/api/user");
        // setUserId(res.data);
        setUserId(1);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const submitHandler = (values: Values) => {
    setPresentationTime(values.time);
    navigate("/presentation");
  };

  return (
    <>
      {/*<Drawer opened={opened} onClose={close} position="right" overlayProps={{backgroundOpacity: 0}}>*/}
      {/*    <FaSignOutAlt size="200px">*/}
      {/*        <Signout/>*/}
      {/*    </FaSignOutAlt>*/}
      {/*</Drawer>*/}
      <div>
        <div>
          <Flex p="10px" justify="space-between">
            <div className="prapre-container">
              <div className="prapre-mask"></div>
              <h1>PraPre</h1>
              <p>Practice for Presentations</p>
            </div>
            {/* <Menu shadow="md" width={200}>
                            <Menu.Target>
                                <Button>button</Button>
                                <Burger size="lg" opened={opened} onClick={toggle} aria-label="Toggle navigation"/>
                            </Menu.Target>
                            <Menu.Dropdown>
                                <Menu.Item leftSection={<FaUser/>}>
                                    アカウント
                                </Menu.Item>
                                <Menu.Item onClick={() => {
                                    <Signout/>
                                }} leftSection={<FaSignOutAlt/>}>
                                    サインアウト
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu> */}
          </Flex>
        </div>

        <div>
          <Flex direction="column" align="center">
            <div className="drop-container" style={{ width: "80%" }}>
              {slide && (
                <div className="thumnail-container">
                  <Document file={slide}>
                    <Page width={200} pageNumber={1} />
                  </Document>
                </div>
              )}
              <PdfDropzone setSlide={setSlide} />
            </div>

            <form onSubmit={form.onSubmit(submitHandler)}>
              <Group justify="flex-end" mt="md">
                <TimeInput
                  ref={ref}
                  // label="アイコンをクリックして時間を入力してください" ref={ref}
                  rightSection={pickerControl}
                  key={form.key("time")}
                  {...form.getInputProps("time")}
                />
                <Button type="submit" w="150px" h="25px">
                  すすむ
                </Button>
                <span>※ 推奨ブラウザ Chrome</span>
              </Group>
            </form>
          </Flex>
        </div>
      </div>
    </>
  );
};

export default Home;
