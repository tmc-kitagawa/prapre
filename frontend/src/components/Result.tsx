import  {FC, useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {SlideResult, History} from "../global";

import {NavLink, Drawer, Button, Center, Box, Flex, Menu, Burger} from "@mantine/core";
import {RadarChart} from '@mantine/charts';
import {useDisclosure} from "@mantine/hooks";
import '@mantine/charts/styles.css';
import {FaRegChartBar, FaHistory, FaSignOutAlt, FaHome, FaRedo, FaUser} from "react-icons/fa";

import OneBarChart from "./OneBarChart.tsx";

import axios from "axios";
import "moment/dist/locale/ja"
import moment from "moment";
import Signout from "./Signout.tsx";

interface Props {
    userId: number | null;
    fillers: number[]
    volumes: number[]
}

const Result: FC<Props> = ({userId, fillers, volumes}) => {
    const [histories, setHistories] = useState<History[] | undefined>(undefined)
    const [activeHistory, setActiveHistory] = useState<number>(0)
    const [drawerData, setDrawerData] = useState<boolean>(false)
    const [openedToggle, { toggle }] = useDisclosure();
    const [opened, {open, close}] = useDisclosure(false);
    const location = useLocation();
    const navigate = useNavigate();
    const data: Record<string, any>[] = useLocation().state.map((obj: SlideResult, idx: number) => ({
        slide: "slide " + (idx + 1),
        score: obj.countPercentage
    }))

    const dataSpeed: Record<string, any>[] = useLocation().state.map((obj: SlideResult, idx: number) => ({
        slide: "slide " + (idx + 1),
        score: obj.countFastSpeed
    }))

    const countPages = location.state.length;

    const totalEye = location.state.map((obj: SlideResult) => {
        return obj.countPercentage
    }).reduce((acc: number, cur: number) => acc + cur, 0)

    const eyeScore = Math.floor(totalEye / countPages);

    const totalSpeed = location.state.map((obj: SlideResult) => {
        return obj.countFastSpeed
    }).reduce((acc: number, cur: number) => acc + cur, 0)

    const speedScore = Math.floor(totalSpeed / countPages);

    const scoreData = [
        {product: '目線', 今回の結果: eyeScore, 目標: 80},
        {product: '速度', 今回の結果: speedScore, 目標: 80},
        {product: 'ハキハキ', 今回の結果: 40, 目標: 80},
        {product: '時間', 今回の結果: 90, 目標: 80},
        {product: '繋ぎ言葉', 今回の結果: 100, 目標: 80}
    ]

    useEffect(() => {
        while (document.getElementById("webgazerVideoContainer")) {
            document.getElementById("webgazerVideoContainer")!.remove()
        }
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const res = await axios(`/api/presentations/${userId}`)
                setHistories(res.data)
            } catch (err) {
                console.log(err)
            }
        })()
    }, []);

    const [mergedRadarData, setMergedRadarData] = useState<Record<string, any>[]>(scoreData);
    const selectHistory = (idx: number) => {
        setActiveHistory(idx);
        if (histories) {
            const dataHistory = [histories[idx].scoreEye, histories[idx].scoreSpeed, histories[idx].scoreVolume, histories[idx].scoreTime, histories[idx].scoreFiller]
            setMergedRadarData(scoreData.map((obj, idx) => {
                return Object.assign(obj, {履歴: dataHistory[idx]})
            }));
        }
    }

    // setTimeout(async () => {
    //     const res = await axios.post("/api/histories", {
    //         title: "prapre",
    //         startTime: 1719904090394,
    //         userId: 1,
    //         scoreEye: 50,
    //         scoreVolume: 68,
    //         scoreFiller: 5,
    //         scoreSpeed: 60,
    //         scoreTime: 70
    //     });
    //     console.log(res);
    // }, 5000)

    return (
        <>
            <Drawer opened={opened} onClose={close} position="right" overlayProps={{backgroundOpacity: 0}}>
                {drawerData ?
                    <>
                        <NavLink label={"ユーザーアカウント"} leftSection={<FaUser size="50px"/>}/>
                        <NavLink label={"ログアウト"} leftSection={<FaSignOutAlt size="50px"><Signout/></FaSignOutAlt>}/>
                    </>
                    : histories && histories.map((history, idx) => (
                    <div>
                        <NavLink key={history.title} defaultOpened style={{width: "100%"}}
                                 active={idx === activeHistory} onClick={() => selectHistory(idx)}
                                 label={<RadarChart h={80}
                                                    data={[{product: '目線', score: history.scoreEye},
                                                        {product: '速度', score: history.scoreSpeed,},
                                                        {product: 'ハキハキ', score: history.scoreVolume},
                                                        {product: '時間', score: history.scoreTime,},
                                                        {product: '繋ぎ言葉', score: history.scoreFiller}]}
                                                    dataKey="product"
                                                    series={[{name: 'score', color: 'blue.4', opacity: 0.5}]}
                                                    withPolarGrid
                                                    withPolarAngleAxis
                                 />} leftSection={moment(new Date(history.startTime)).fromNow()}>
                        </NavLink>
                    </div>
                ))}
            </Drawer>
            <Flex p="10px" justify="flex-end">
                <Menu shadow="md" width={200}>
                    <Menu.Target>
                        {/*<Button>button</Button>*/}
                        <Burger size="lg" opened={openedToggle} onClick={toggle} aria-label="Toggle navigation" />
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Item leftSection={<FaUser/>}>
                            アカウント
                        </Menu.Item>
                        <Menu.Item onClick={() => {<Signout/>}}  leftSection={ <FaSignOutAlt/>} >
                            サインアウト
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </Flex>
            <Center>
                {mergedRadarData[0]["履歴"] ?
                    <RadarChart h={500}
                                w={500}
                                data={mergedRadarData}
                                dataKey="product"
                                series={[
                                    {name: '目標', color: 'rgba(255,255,255,1)', strokeColor: 'red', opacity: 0},
                                    {name: '今回の結果', color: 'blue.4', strokeColor: 'blue', opacity: 0.2},
                                    {name: '履歴', color: 'green.4', strokeColor: 'green', opacity: 0.2}
                                ]}
                                withPolarGrid
                                withPolarAngleAxis
                                withLegend
                    /> :
                    <RadarChart h={500}
                                w={500}
                                data={mergedRadarData}
                                dataKey="product"
                                series={[
                                    {name: '目標', color: 'rgba(255,255,255,1)', strokeColor: 'red', opacity: 0},
                                    {name: '今回の結果', color: 'blue.4', strokeColor: 'blue', opacity: 0.2}
                                ]}
                                withPolarGrid
                                withPolarAngleAxis
                                withLegend
                    />
                }
            </Center>
            <Flex gap="70px" p="10px" justify="center" align="center">
                <Button leftSection={<FaRedo/>}>
                    もう一度練習する
                </Button>
                <Button variant="default" leftSection={<FaHistory/>} onClick={() => {
                    setDrawerData(false)
                    open()
                }}>履歴を表示</Button>
                <Button variant="default" leftSection={<FaHome/>} onClick={() => {navigate('/')}}>
                    ホームへ戻る
                </Button>
            </Flex>
            <Center>
                <Box w="700px">
                    <NavLink leftSection={<FaRegChartBar/>} label="結果の詳細を表示" defaultOpened color="blue.5"
                             active>
                        <OneBarChart key="eye" graphTitle="目線がカメラを向いているか" slideScore={data}/>
                        <OneBarChart key="speed" graphTitle="話す速度" slideScore={dataSpeed}/>
                    </NavLink>
                </Box>
            </Center>
            {JSON.stringify(fillers)}
            {JSON.stringify(volumes)}
        </>
    )
}

export default Result