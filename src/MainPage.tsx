import React, { useEffect, useRef, useState, useCallback } from "react"
import { v4 as uuid } from "uuid"
import { PDFDocument } from 'pdf-lib'
import { makeStyles, Typography } from "@material-ui/core"
import { PDFContent, PDFFile } from './Types'
import PDF from './PDF'
import DragAndDrop from './DragAndDrop'

const useStyles = makeStyles((theme) => ({
  root: {
    display: "grid",
    gridTemplate: "100% / 25% 75%",
    flexGrow: 1,
  },
  sources: {
    padding: theme.spacing(2)
  }
}))

const MainPage = () => {
  const [sources, setSources] = useState<PDFFile[]>([])
  const [destinationPdf, setDestinationPdf] = useState(null)
  const pdfLibDestination = useRef(null)

  const classes = useStyles()

  useEffect(() => { (async () => {
    pdfLibDestination.current = await PDFDocument.create()
  })() }, [])

  const insertPage = async () => {
    const destination = pdfLibDestination.current
    const source = await PDFDocument.load(sources[0].content)
    const [existingPage] = await destination.copyPages(source, [0])
    destination.insertPage(0, existingPage)
    setDestinationPdf(await destination.saveAsBase64({ dataUri: true }))
  }

  const addSource = useCallback(
    (content: PDFContent, name: string) => {
      setSources((oldSources) => [{ id: uuid(), content, name }, ...oldSources])
    },
    [],
  )

  return (
    <div className={classes.root}>
      <DragAndDrop onLoad={addSource} className={classes.sources}>
        <Typography>Sources</Typography>
        {sources?.map((source) => (
          <PDF file={source.content} key={source.id} />
        ))}
      </DragAndDrop>
      <div>
        <button onClick={insertPage} disabled={!sources || !pdfLibDestination}>Insert page</button>
        <h1>Destination pdf</h1>
        <PDF file={destinationPdf} />
      </div>
    </div>
  )
}

export default MainPage
