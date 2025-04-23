import { FC, useEffect, useRef, useState } from 'react';
import { Transition } from 'react-transition-group';
import classNames from 'classnames';

import { INotificationWithId } from '../../interfaces/notification.interface.ts';
import { useNotification } from '../../hooks/useNotification.ts';

import { DELAY_AUTO_DELETION, DURATION } from '../../constants';

import CloseIcon from '../../../../../assets/icons/notification-icons/close-notification-icon.svg';

import styles from './Notification.module.css';

/**
 * Компонент уведомления.
 * @param {INotificationWithId} props - Пропсы компонента.
 * @returns {JSX.Element}
 * */
export const Notification: FC<INotificationWithId> = ({
	id,
	type,
	text,
	title,
	icon,
	delay,
	content,
	position,
	classNameNotification,
	autoDeletion = true,
}) => {

	//ПРЕВЕД
	const { remove } = useNotification();

	const [inProp, setInProp] = useState<boolean>(true);

	const nodeRef = useRef(null);

	/** Стили по умолчанию. */
	const defaultStyle = {
		transition: `opacity ${DURATION}ms ease`,
		opacity: 1,
	};

	/** Переходные стили. */
	const transitionStyles = {
		entering: { opacity: 1 },
		entered: { opacity: 1 },
		exiting: { opacity: 0 },
		exited: { opacity: 0 },
		unmounted: {},
	};

	/**
	 * Функция срабатывающая при завершении анимации.
	 * @returns {Void}
	 * */
	const onExited = (): void => {
		remove(id);
	};

	/** Удаление уведомления по истечению времени. */
	useEffect(() => {
		if (!autoDeletion) return;

		const timeoutId = setTimeout(() => {
			setInProp(false);
		}, delay || DELAY_AUTO_DELETION);

		return () => clearTimeout(timeoutId);
	}, [autoDeletion, delay]);

	return (
		<Transition
			nodeRef={nodeRef}
			in={inProp}
			timeout={DURATION}
			unmountOnExit={true}
			onExited={onExited}
		>
			{(state) => (
				<div
					ref={nodeRef}
					className={classNames(
						styles.container,
						position && styles[position],
						type && styles[type],
						classNameNotification
					)}
					style={{
						...defaultStyle,
						...transitionStyles[state],
					}}
				>
					{icon && <div className={styles.icon}>{icon}</div>}
					<div className={styles.content}>
						<div className={styles.title}>
							<span>{title}</span>
						</div>
						{content}
						{!content && text && <span>{text}</span>}
					</div>

					<button
						type={'button'}
						className={styles.closeButton}
						onClick={() => setInProp(false)}
					>
						<CloseIcon />
					</button>
				</div>
			)}
		</Transition>
	);
};
