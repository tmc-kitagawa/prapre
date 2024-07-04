import React from 'react';
import {Document, Page, pdfjs} from 'react-pdf';
import './PdfViewer.scss'
import {Center, Progress} from "@mantine/core";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface Props {
    file: File | null | string; // PDFファイルのURL
    slideHandle: () => void;
    started: boolean;
}

const PdfViewer: React.FC<Props> = ({file, slideHandle, started}) => {
    const [numPages, setNumPages] = React.useState(0);
    const [pageNumber, setPageNumber] = React.useState(1);

    // PDFファイルのページ数を取得する
    const onDocumentLoadSuccess = ({numPages}: { numPages: number }) => {
        setNumPages(numPages);
    };

    // ページ番号を変更する
    const changePage = (offset: number) => {
        if (offset === 1 && pageNumber >= 1 && pageNumber < numPages) {
            slideHandle()
            setPageNumber((prevPageNumber) => prevPageNumber + offset);
        }
    };

    // デバッグ中
    // useEffect(() => {
    //     if (started) {
    //         window.addEventListener('keydown', (e: KeyboardEvent) => {
    //             if (e.key === "Enter" || e.key === "ArrowDown" || e.key === "ArrowRight") {
    //                 changePage(1)
    //             }
    //         })
    //     }
    // }, [started]);

    return (
        <>
            <div className='pdf-container' onClick={() => started ? changePage(1) : null}>
                <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
                    <Page width={1100} pageNumber={pageNumber}/>
                </Document>
            </div>
            <Center mt="10px">
                <Progress w="1100px" value={100 * pageNumber / numPages}/>
            </Center>
        </>
    );
};

export default PdfViewer;
