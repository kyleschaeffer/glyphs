import { Splash } from '../components/Splash'

export default function ErrorRoute() {
  return (
    <Splash
      title={
        <>
          Something
          <br />
          went wrong
        </>
      }
    >
      🚧
    </Splash>
  )
}
