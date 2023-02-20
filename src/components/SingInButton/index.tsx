import { FiX } from 'react-icons/fi'
import { FaGithub } from 'react-icons/fa'
import styles from './styles.module.scss';
import { signIn, useSession, signOut } from 'next-auth/react';

export function SignInButton() {
    const { data, status } = useSession();

    return status === "authenticated" ? (
<button type="button" className={styles.signInButton} onClick={() => signOut()}>
            <FaGithub color='#04d361'/>
            {data.user != undefined ? data.user.name : 'Erro'}
            <FiX color='#737380' className={styles.closeIcon} />
        </button>
    ) : (
        <button type="button" className={styles.signInButton} onClick={() => signIn('github')}>
            <FaGithub color='#eba417'/>
            Sign in with Github 
        </button>

    );
}