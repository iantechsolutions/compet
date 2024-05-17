import AuthProfileRestriction from '~/components/auth-provider/auth-profile-restriction'

export default function Layout(props: { children: React.ReactNode }) {
    return <AuthProfileRestriction requireSeller={true}>{props.children}</AuthProfileRestriction>
}
