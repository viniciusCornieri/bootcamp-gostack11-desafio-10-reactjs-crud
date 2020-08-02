import React, { useState, useEffect, useCallback } from 'react';

import Header from '../../components/Header';

import api from '../../services/api';

import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';

import { FoodsContainer } from './styles';

interface IFoodPlate {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  available: boolean;
}

const Dashboard: React.FC = () => {
  const [foods, setFoods] = useState<IFoodPlate[]>([]);
  const [editingFood, setEditingFood] = useState<IFoodPlate>({} as IFoodPlate);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function loadFoods(): Promise<void> {
      const response = await api.get('/foods');
      setFoods(response.data);
    }

    loadFoods();
  }, [setFoods]);

  async function handleAddFood(
    food: Omit<IFoodPlate, 'id' | 'available'>,
  ): Promise<void> {
    try {
      // TODO ADD A NEW FOOD PLATE TO THE API
    } catch (err) {
      console.log(err);
    }
  }

  const handleUpdateFood = useCallback(
    (food: Omit<IFoodPlate, 'id' | 'available'>): void => {
      async function callUpdateApi(): Promise<void> {
        await api.put(`/food/${editingFood.id}`, food);
      }

      callUpdateApi();
      setFoods(
        foods.map(f =>
          f.id === editingFood.id ? { ...editingFood, ...f } : f,
        ),
      );
    },
    [editingFood, setFoods, foods],
  );

  const handleDeleteFood = useCallback(
    (id: number): void => {
      async function callDeleteApi(): Promise<void> {
        await api.delete(`/foods/${id}`);
      }

      callDeleteApi();
      setFoods(foods.filter(food => food.id !== id));
    },
    [setFoods, foods],
  );

  const toggleModal = useCallback(() => {
    setModalOpen(!modalOpen);
  }, [setModalOpen, modalOpen]);

  const toggleEditModal = useCallback(() => {
    setEditModalOpen(!editModalOpen);
  }, [setEditModalOpen, editModalOpen]);

  const handleEditFood = useCallback(
    (food: IFoodPlate) => {
      toggleEditModal();
      setEditingFood(food);
    },
    [toggleEditModal, setEditingFood],
  );

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
