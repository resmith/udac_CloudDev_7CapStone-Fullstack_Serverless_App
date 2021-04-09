import React, { useEffect, useState } from "react"
import { withRouter, useParams, Link } from "react-router-dom"

import styles from "./Pics.module.css"
import { Header, Form, Button } from "semantic-ui-react"
import {
	getSpace,
	getUploadUrl,
	uploadFile,
	getImages,
} from "../../api/spaces-api"

const UploadState = {
	NoUpload: "NoUpload",
	FetchingPresignedUrl: "FetchingPresignedUrl",
	UploadingFile: "UploadingFile",
}

const Pics = (props) => {
	const [space, setSpaceState] = useState(null)
	const [idToken, setIdToken] = useState(props.auth.getIdToken())
	const [uploadState, setUploadState] = useState(UploadState.NoUpload)
	const [file, setFileState] = useState([])
	const [images, setImages] = useState([])
	let { spaceId } = useParams()
	let imageResponse

	const getPageSpace = async (spaceId, idToken) => {
		try {
			const response = await getSpace(spaceId, idToken)
			console.log("Pics useEffect getSpace: ", response)
			setSpaceState(response.Item)
		} catch (e) {
			console.error(e)
		}
	}

	const getPageImages = async (spaceId, idToken) => {
		try {
			imageResponse = await getImages(idToken, spaceId)
			console.log("Pics useEffect imageResponse: ", imageResponse)
			setImages(imageResponse.images)
			console.log("Pics useEffect images: ", images)
		} catch (e) {
			console.error(e)
		}
	}

	useEffect(() => {
		;(async () => {
			console.log("Pics props: ", props)
			console.log("Pics spaceId: ", spaceId)
			console.log("Pics idToken: ", idToken)

			await getPageSpace(spaceId, idToken)
			await getPageImages(spaceId, idToken)
		})()
	}, [spaceId, idToken])

	const handleFileChange = (event) => {
		const files = event.target.files
		if (!files) return

		setFileState(files[0])
	}

	const handleSubmit = async (event) => {
		event.preventDefault()

		console.log("Pics handleSubmit file: ", file)
		console.log("Pics handleSubmit spaceId: ", spaceId)
		console.log("Pics handleSubmit idToken: ", idToken)

		try {
			if (!file || file.length === 0) {
				alert("File should be selected")
				return
			}

			setUploadState(UploadState.FetchingPresignedUrl)
			const uploadUrl = await getUploadUrl(idToken, spaceId)
			console.log("Pics handleSubmit uploadUrl: ", uploadUrl)

			setUploadState(UploadState.UploadingFile)
			await uploadFile(uploadUrl, file)

			// alert("File was uploaded!")
			setFileState(null)
		} catch (e) {
			alert("Could not upload a file: " + e.message)
		} finally {
			setUploadState(UploadState.NoUpload)
			await getPageImages(spaceId, idToken)
			console.log("Pics handleSubmit images: ", images)
		}
	}

	console.log("Pics space: ", space)

	if (!space) {
		return <div>Loading...</div>
	}

	const renderButton = () => {
		return (
			<div>
				{uploadState === UploadState.FetchingPresignedUrl && (
					<p>Uploading image metadata</p>
				)}
				{uploadState === UploadState.UploadingFile && <p>Uploading file</p>}
				<Button loading={uploadState !== UploadState.NoUpload} type="submit">
					Upload
				</Button>
			</div>
		)
	}

	console.log("Pics b4return images: ", images)
	return (
		<div className={`${styles.container} animateFadeIn`}>
			<div className={styles.containerInner}>
				<div className={styles.containerHeader}>
					<Header textAlign="center" as="h1">
						<Link to={`/spaces/${space.spaceId}`}>{space.name}</Link>
					</Header>
				</div>
				<div className={styles.containerContent}>
					<div>
						{images &&
							images.map((image) => {
								return (
									<img
										key={image.imageId}
										class="ui small image spaced"
										alt={`from ${space.name}`}
										src={image.attachmentUrl}
									></img>
								)
							})}
					</div>
				</div>
				<Form onSubmit={handleSubmit}>
					<Form.Field>
						<div class="ui mini labeled input">
							<div class="ui label">File</div>
							<input
								type="file"
								accept="image/*"
								placeholder="Image to upload"
								onChange={handleFileChange}
							/>
						</div>
					</Form.Field>

					{renderButton()}
				</Form>
			</div>
		</div>
	)
}

export default withRouter(Pics)
