import React, { FC } from 'react';
import PropTypes from 'prop-types';
import { Column } from './interfaces/column';

interface Props {
    columns: Column[],
    dataSource: any[]
}

const DataGrid: FC<Props> = ({ columns, dataSource }) => {
  if (columns.length === 0) {
    const firstItem = dataSource.length > 0 ? dataSource[0] : null;

    if (firstItem) {
        const keys = Object.keys(firstItem);

        columns = keys.map(key => ({
            header: key,
            property: key
        }));
    }
  }

  return(
    <table>
        <thead>
            <tr>
            { 
                columns.map(column => (
                    <th key={column.header}>{column.header}</th>
                ))
            }
            </tr>
        </thead>
        <tbody>
            { 
                dataSource.map(row => (
                    <tr key={row["userId"]}>
                        {
                            columns.map(col => (
                                col.property === 'userId' ? (
                                    <td key={row['userId'] + row[col.property]}><a href={`/users/edit/${row[col.property]}`}>{row[col.property]}</a></td> 
                                ) : (
                                    <td key={row['userId'] + row[col.property]}>{row[col.property]}</td> 
                                )
                            ))
                        }
                    </tr>
                ))
            }
        </tbody>
    </table>
  );
}

DataGrid.propTypes = {
  columns: PropTypes.array.isRequired,
  dataSource: PropTypes.array.isRequired
}

export default DataGrid;