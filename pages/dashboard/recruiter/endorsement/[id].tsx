import React, { FC, useState, useRef, useEffect } from 'react'
import styles from '../../../../styles/components/dashboard/endorsement/view.module.scss'
import { endorsementById, getAllEndorsement, endorsementComment } from '../../../../util/endorsement/endorsement.query'
import { format } from 'date-fns'
import { client } from '../../../_app'
import PageWithLayout from '../../../../layout/page.layout'
import Dashboard from '../../../../layout/dashboard.layout'
import Head from 'next/head'
import dynamic from 'next/dynamic'

const Endorse = dynamic(() => import("../../../../components/dashboard/admin/endrosement/endorse"), {
    ssr: false
})


export const getStaticPaths = async () => {
    const { data: { getEndorsementAll } } = await client.query({
        query: getAllEndorsement
    })

    const paths = getEndorsementAll.map(({ endorsementID }: any) => {
        return { params: { id: endorsementID } }
    })
    return {
        paths, fallback: false
    }
}


export const getStaticProps = async (context: any) => {
    const getId = context.params.id
    const { data: { getEndorsementById } } = await client.query({
        query: endorsementById,
        variables: {
            endorsementId: getId
        }
    })

    const { data: { getEndorsementCommnet } } = await client.query({
        query: endorsementComment,
        variables: {
            endorsementId: getId
        }
    })
    return {
        props: {
            endorsement: getEndorsementById,
            comment: getEndorsementCommnet
        }
    }
}

const EndorseviewView: FC = ({ endorsement, comment }: any) => {
    const [ endorse, setEndorse ] = useState(false)
    const [ id, setId ] = useState("")

    useEffect(() => {
        endorsement.map(({ endorsementID }: any) => {
            setId(endorsementID)
        })
    }, [ endorsement ])

    return (
        <div className={styles.container}>
            {endorse ? <div className={styles.end}>
                <Endorse endorsementID={id} close={setEndorse} />
            </div> : null}
            <div className={styles.endorse}>
                <div className={styles.body}>
                    <div className={styles.endorse}>
                        <h2>Personal Information</h2>
                        <button onClick={() => setEndorse(() => !endorse)}>Endorse</button>
                    </div>
                    <div className={styles.newTable}>
                        <table>
                            {
                                endorsement.map(({ endorsementID, email, Status, createdAt, endorseBy, profile }: any) => (
                                    profile.map(({ firstname, lastname, birthday, phone, profileAddress }: any) => (
                                        profileAddress.map(({ zipcode, street, province, city }: any) => (
                                            <tbody key={endorsementID}>
                                                <Head>
                                                    <title>{`${firstname} ${lastname}`}</title>
                                                </Head>
                                                <tr>
                                                    <th>Email</th>
                                                    <td>{email}</td>
                                                </tr>
                                                <tr>
                                                    <th>Name</th>
                                                    <td>{firstname} {lastname}</td>
                                                </tr>
                                                <tr>
                                                    <th>Birthday</th>
                                                    <td>{format(new Date(birthday), "MMMM dd, yyyy")}</td>
                                                </tr>
                                                <tr>
                                                    <th>Phone</th>
                                                    <td>{phone}</td>
                                                </tr>
                                                <tr>
                                                    <th>Address</th>
                                                    <td>{street}, {city} {province}, {zipcode}</td>
                                                </tr>
                                                <tr>
                                                    <th>Status</th>
                                                    <td className={styles.status}>
                                                        {Status}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th>Endorse Date</th>
                                                    <td>{format(new Date(createdAt), "MMMM dd, yyyy")}</td>
                                                </tr>
                                                {endorseBy.map(({ profile }: any) => (
                                                    profile.map(({ profileID, firstname, lastname }: any) => (
                                                        <tr key={profileID}>
                                                            <th>Endorse By</th>
                                                            <td>{firstname} {lastname}</td>
                                                        </tr>
                                                    ))
                                                ))}

                                            </tbody>
                                        ))
                                    ))
                                ))
                            }
                        </table>
                    </div>
                </div>
                {comment.map(({ commentID, message }: any) => (
                    <div key={commentID} className={styles.comments}>
                        <h2>Comment</h2>
                        <span>{message}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

(EndorseviewView as PageWithLayout).layout = Dashboard
export default EndorseviewView
