"use server"
import { api } from "~/trpc/server"
import LayoutContainer from "~/components/layout-container";
import { Title } from "~/components/title";
import { List, ListTile } from "~/components/list";
import { getServerAuthSession } from 'auth-helpers'



export default async function Home(){

    const usuarios = await api.usersList.list()
    // const usuarios = await getServerAuthSession()

    return(
    <LayoutContainer>
    <section className="space-y-2">
        <div className="flex justify-between">
            <Title>Usuarios</Title>
        </div>
        <List>
        {usuarios.map((usuarios) => {
            return (
              <div>

              <ListTile
                key={usuarios.id}
                leading={usuarios?.nombre}
                />
                <h1>{usuarios.email}</h1>
                </div>
            );
          })}
        </List>
    </section>
    </LayoutContainer>
    )
}