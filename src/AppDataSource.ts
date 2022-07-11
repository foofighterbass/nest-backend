import { ConfigModule } from "@nestjs/config"
import { join } from "path"
import { DataSource } from "typeorm"

const config = ConfigModule.forRoot({envFilePath: '.env'})

export const AppDataSource = new DataSource({
    type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      synchronize: true,
})

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })