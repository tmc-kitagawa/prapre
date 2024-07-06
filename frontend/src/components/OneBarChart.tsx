// import {FC} from "react";
// import {SlideScore} from "../global";
import {BarChart} from '@mantine/charts';
import {Box, Center} from "@mantine/core";


export interface Props {
    graphTitle: string,
    slideScore: Record<string, any>[]
    // slideScore: SlideScore
}

const OneBarChart = (props: Props) => {
    const {graphTitle, slideScore} = props;
    return (
        <Box bg="#FFFFFF" m="0.5rem" p="1rem" style={{ '--radius': '0.5rem',borderRadius: 'var(--radius)'}}>
            <Center>
                <p>{graphTitle}</p>
            </Center>
            <Center>
                <BarChart
                    h={250}
                    w={700}
                    data={slideScore}
                    dataKey="slide"
                    yAxisProps={{domain: [0, 100]}}
                    referenceLines={[
                        {
                            y: 80,
                            color: 'red.9',
                            labelPosition: 'insideTopRight',
                        },
                    ]}
                    legendProps={{verticalAlign: 'bottom'}}
                    series={[
                        {name: 'score', color: 'blue.4'},
                    ]}
                />
            </Center>
        </Box>
    )
}

export default OneBarChart;
