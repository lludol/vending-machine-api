import {
	TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { FunctionComponent, useCallback, useContext } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { useProducts } from '../../data/products.swr';
import ToastContext, { ToastContextType } from '../../contexts/ToastProvider';
import { deleteProduct } from '../../data/products';

interface Props {
	onEdit: (id: number) => void;
}

const IconStyle = {
	cursor: 'pointer',
};

export const TableProducts: FunctionComponent<Props> = ({ onEdit }) => {
	const { data: products, mutate: mutateProducts } = useProducts();
	const { toast } = useContext<ToastContextType>(ToastContext);

	const onClickDelete = useCallback(async (id: number) => {
		try {
			await deleteProduct(id);
			await mutateProducts();
			toast('Product deleted');
		} catch (error) {
			toast('An error occurred');
		}
	}, [toast, mutateProducts]);

	return (
		<TableContainer component={Paper}>
			<Table sx={{ minWidth: 650 }} aria-label="simple table">
				<TableHead>
					<TableRow>
						<TableCell>Name</TableCell>
						<TableCell align="right">Price</TableCell>
						<TableCell align="right">Amount available</TableCell>
						<TableCell align="right"></TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{products && products.map((product) => (
						<TableRow
							key={product.id}
							sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
						>
							<TableCell component="th" scope="row">{product.productName}</TableCell>
							<TableCell align="right">${product.cost}</TableCell>
							<TableCell align="right">{product.amountAvailable}</TableCell>
							<TableCell align="right">
								<EditIcon color="info" style={IconStyle} onClick={() => onEdit(product.id)}/>
								<DeleteIcon color="error" style={IconStyle} onClick={() => onClickDelete(product.id)}/>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};