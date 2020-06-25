import React, { useContext, useRef, useEffect } from 'react';
import ContactContext from '../../context/contact/contactContext';

const ContactFilter = () => {
  const contactContext = useContext(ContactContext);
  // initialize the ContactContext
  const text = useRef('');

  const { filterContact, clearFilter, filtered } = contactContext;

  useEffect(() => {
    if (filtered === null) {
      text.current.value = '';
    }
  });

  const onChange = (e) => {
    if (text.current.value !== '') {
      //   console.log('FELIPAO DOISS');
      //   console.log(text.current.value);
      //   console.log(e.target.value);
      filterContact(e.target.value);
    } else {
      clearFilter();
    }
  };

  return (
    <form>
      {/* in ref={text} we could use whatever we want */}
      <input
        type='text'
        ref={text}
        placeholder='Filter Contacts'
        onChange={onChange}
      />
    </form>
  );
};

export default ContactFilter;
