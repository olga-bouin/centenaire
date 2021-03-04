import Document, {Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx)
        return  {...initialProps}
    }
    render() {
        return (
            <Html>
                <Head>
                    <meta content="width=device-width, initial-scale=1.0"/>
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}
export default MyDocument