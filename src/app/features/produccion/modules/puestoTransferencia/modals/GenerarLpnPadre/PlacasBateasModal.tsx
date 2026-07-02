/* eslint-disable unused-imports/no-unused-vars */
import React, { useState } from 'react';
import FetchApi from 'app/shared/helpers/FetchApi';
import { TrazaOperacionesSliceRequests } from 'app/Middleware/reducers/TrazaOperacionesSlice';
import { TrazaOperacionesWithOpDTO } from 'app/models/DTO/TrazaOperacionesWithOpDTO';
import { TableComponent } from 'app/shared/components/Table/TableComponent';

interface Props {
    setOpenModal: (newValue: boolean) => void
    openModal: boolean
    codigoBatea: string
}

export const PlacasBateasModal: React.FC<Props> = ({ setOpenModal, openModal, codigoBatea }) => {

    const [placasBatea, setPlacasBatea] = useState<TrazaOperacionesWithOpDTO[]>([])
    FetchApi<TrazaOperacionesWithOpDTO[]>(TrazaOperacionesSliceRequests.GetAllTracesByPuntDTO, codigoBatea, false, openModal, setPlacasBatea, true)

    return (
        <main className="w-[70vw]">
            <section>
                <TableComponent
                    IDcolumn="id"
                    buscar
                    dataInfo={placasBatea}
                    columns={[
                        {
                            title: "Modelo",
                            field: "modelo"
                        },
                        {
                            title: "Semielaborado",
                            field: "semiElaborado"
                        },
                        {
                            title: "Familia",
                            field: "familia"
                        },
                        {
                            title: "Codigo Placa",
                            field: "codigoInit"
                        },
                        {
                            title: "Numero OP",
                            field: "numeroOp"
                        }
                    ]}
                />
            </section>
        </main>
    )
}