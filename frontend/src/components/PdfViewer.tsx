import React, {forwardRef, useImperativeHandle} from 'react';
import {Document, Page, pdfjs} from 'react-pdf';
import './PdfViewer.scss'
import {Center, Progress} from "@mantine/core";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface Props {
    file: File | null | string; // PDFファイルのURL
    slideHandle: () => void;
    started: boolean;
    numPages: number;
}

interface ChangePageHandle {
    changePage(arg: number): void;
}

const PdfViewer = forwardRef<ChangePageHandle, Props>(({file, slideHandle, started, numPages}, ref) => {
    const [pageNumber, setPageNumber] = React.useState(1);

    const changePage = (offset: number) => {
        if (offset === 1 && pageNumber >= 1 && pageNumber < numPages) {
            slideHandle()
            setPageNumber((prevPageNumber) => prevPageNumber + offset);
        }
    }

    useImperativeHandle(ref, () => ({
        changePage
    }))

    return (
        <>
            <div className='pdf-container' onClick={() => started ? changePage(1) : null}>
                <Document file={file}>
                    <Page width={1100} pageNumber={pageNumber}/>
                </Document>
            </div>
            <Center mt="10px">
                <Progress w="1100px" value={100 * pageNumber / numPages}/>
            </Center>
        </>
    );
});

export default PdfViewer;
